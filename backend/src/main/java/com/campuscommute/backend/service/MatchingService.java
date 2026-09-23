package com.campuscommute.backend.service;

import com.campuscommute.backend.config.AppProperties;
import com.campuscommute.backend.dto.match.MatchResponse;
import com.campuscommute.backend.entity.Trip;
import com.campuscommute.backend.entity.TripMatch;
import com.campuscommute.backend.enums.MatchStatus;
import com.campuscommute.backend.enums.TripStatus;
import com.campuscommute.backend.exception.ResourceNotFoundException;
import com.campuscommute.backend.exception.UnauthorizedActionException;
import com.campuscommute.backend.repository.TripMatchRepository;
import com.campuscommute.backend.repository.TripRepository;
import com.campuscommute.backend.util.GeoUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * The distance-time matching engine.
 *
 * For a given trip, it looks at every other ACTIVE trip of the same type
 * (TO_CAMPUS / FROM_CAMPUS) whose departure time falls inside the configured
 * time window, computes:
 *   - origin distance (km)   -> Haversine distance between the two pickup points
 *   - destination distance (km) -> Haversine distance between the two drop-off points
 *   - time difference (minutes) -> |departureTime_A - departureTime_B|
 *
 * and filters out anything outside the configured max distance / time window.
 * What's left is scored 0-100 (higher = better match) and persisted as a
 * TripMatch, so both students can see the suggestion from either side.
 */
@Service
@RequiredArgsConstructor
public class MatchingService {

    private final TripRepository tripRepository;
    private final TripMatchRepository tripMatchRepository;
    private final TripMapper tripMapper;
    private final AppProperties appProperties;

    @Transactional
    public List<MatchResponse> generateMatchesForTrip(Trip trip) {
        double maxDistanceKm = appProperties.getMatching().getMaxDistanceKm();
        int maxTimeWindowMinutes = appProperties.getMatching().getMaxTimeWindowMinutes();

        LocalDateTime windowStart = trip.getDepartureTime().minusMinutes(maxTimeWindowMinutes);
        LocalDateTime windowEnd = trip.getDepartureTime().plusMinutes(maxTimeWindowMinutes);

        List<Trip> candidates = tripRepository.findByTripTypeAndStatusAndUserIdNotAndDepartureTimeBetween(
                trip.getTripType(),
                TripStatus.ACTIVE,
                trip.getUser().getId(),
                windowStart,
                windowEnd
        );

        return candidates.stream()
                .map(candidate -> tryMatch(trip, candidate, maxDistanceKm, maxTimeWindowMinutes))
                .flatMap(Optional::stream)
                .map(this::toResponse)
                .sorted((a, b) -> Double.compare(b.getMatchScore(), a.getMatchScore()))
                .toList();
    }

    private Optional<TripMatch> tryMatch(Trip tripA, Trip tripB, double maxDistanceKm, int maxTimeWindowMinutes) {
        double originDistanceKm = GeoUtils.distanceKm(
                tripA.getOriginLat(), tripA.getOriginLng(),
                tripB.getOriginLat(), tripB.getOriginLng()
        );
        double destinationDistanceKm = GeoUtils.distanceKm(
                tripA.getDestinationLat(), tripA.getDestinationLng(),
                tripB.getDestinationLat(), tripB.getDestinationLng()
        );
        long timeDifferenceMinutes = Math.abs(
                Duration.between(tripA.getDepartureTime(), tripB.getDepartureTime()).toMinutes()
        );

        boolean withinDistance = originDistanceKm <= maxDistanceKm && destinationDistanceKm <= maxDistanceKm;
        boolean withinTimeWindow = timeDifferenceMinutes <= maxTimeWindowMinutes;

        if (!withinDistance || !withinTimeWindow) {
            return Optional.empty();
        }

        double score = computeMatchScore(originDistanceKm, destinationDistanceKm, timeDifferenceMinutes,
                maxDistanceKm, maxTimeWindowMinutes);

        // Avoid duplicate rows if this pair has already been matched (e.g. re-run of matching).
        TripMatch match = tripMatchRepository.findByTripPair(tripA.getId(), tripB.getId())
                .orElseGet(() -> TripMatch.builder()
                        .tripA(tripA)
                        .tripB(tripB)
                        .status(MatchStatus.SUGGESTED)
                        .build());

        match.setOriginDistanceKm(round2(originDistanceKm));
        match.setDestinationDistanceKm(round2(destinationDistanceKm));
        match.setTimeDifferenceMinutes(timeDifferenceMinutes);
        match.setMatchScore(round2(score));

        return Optional.of(tripMatchRepository.save(match));
    }

    /**
     * Weighted composite score, 0-100. Distance is weighted more heavily than
     * time since "same route" matters more than "exact same minute" for
     * carpool feasibility; both are normalized against the configured max
     * thresholds so the score degrades linearly as a candidate approaches
     * the edge of what counts as a match at all.
     */
    private double computeMatchScore(double originDistanceKm, double destinationDistanceKm,
                                      long timeDifferenceMinutes, double maxDistanceKm, int maxTimeWindowMinutes) {
        double avgDistanceKm = (originDistanceKm + destinationDistanceKm) / 2.0;

        double distanceScore = 1.0 - (avgDistanceKm / maxDistanceKm);   // 1 = same point, 0 = at the edge
        double timeScore = 1.0 - ((double) timeDifferenceMinutes / maxTimeWindowMinutes);

        distanceScore = Math.max(0, Math.min(1, distanceScore));
        timeScore = Math.max(0, Math.min(1, timeScore));

        double weighted = (distanceScore * 0.7) + (timeScore * 0.3);
        return weighted * 100.0;
    }

    private double round2(double value) {
        return Math.round(value * 100.0) / 100.0;
    }

    public List<MatchResponse> getMatchesForTrip(Long tripId) {
        return tripMatchRepository.findAllForTrip(tripId).stream()
                .map(this::toResponse)
                .toList();
    }

    public List<MatchResponse> getMatchesForUser(Long userId) {
        return tripMatchRepository.findAllForUser(userId).stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public MatchResponse respondToMatch(Long userId, Long matchId, boolean accept) {
        TripMatch match = tripMatchRepository.findById(matchId)
                .orElseThrow(() -> new ResourceNotFoundException("Match not found with id: " + matchId));

        boolean isParticipant = match.getTripA().getUser().getId().equals(userId)
                || match.getTripB().getUser().getId().equals(userId);

        if (!isParticipant) {
            throw new UnauthorizedActionException("You are not part of this match");
        }

        match.setStatus(accept ? MatchStatus.ACCEPTED : MatchStatus.REJECTED);

        if (accept) {
            match.getTripA().setStatus(TripStatus.MATCHED);
            match.getTripB().setStatus(TripStatus.MATCHED);
        }

        match = tripMatchRepository.save(match);
        return toResponse(match);
    }

    private MatchResponse toResponse(TripMatch match) {
        return MatchResponse.builder()
                .matchId(match.getId())
                .myTrip(tripMapper.toResponse(match.getTripA()))
                .matchedTrip(tripMapper.toResponse(match.getTripB()))
                .originDistanceKm(match.getOriginDistanceKm())
                .destinationDistanceKm(match.getDestinationDistanceKm())
                .timeDifferenceMinutes(match.getTimeDifferenceMinutes())
                .matchScore(match.getMatchScore())
                .status(match.getStatus())
                .build();
    }
}
