package com.campuscommute.backend.service;

import com.campuscommute.backend.dto.common.DashboardResponse;
import com.campuscommute.backend.dto.trip.TripResponse;
import com.campuscommute.backend.entity.Trip;
import com.campuscommute.backend.enums.TripStatus;
import com.campuscommute.backend.repository.TripRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Builds the ride-history dashboard: a single view of everything a student has
 * posted plus their match activity, including a rough "trips avoided" figure
 * for the sustainability angle of the project (one completed match = at least
 * one fewer solo auto/cab trip).
 */
@Service
@RequiredArgsConstructor
public class DashboardService {

    private final TripRepository tripRepository;
    private final TripMapper tripMapper;
    private final MatchingService matchingService;

    public DashboardResponse getDashboard(Long userId) {
        List<Trip> allTrips = tripRepository.findByUserIdOrderByDepartureTimeDesc(userId);

        List<TripResponse> active = filterAndMap(allTrips, TripStatus.ACTIVE);
        List<TripResponse> matched = filterAndMap(allTrips, TripStatus.MATCHED);
        List<TripResponse> completed = filterAndMap(allTrips, TripStatus.COMPLETED);
        List<TripResponse> cancelled = filterAndMap(allTrips, TripStatus.CANCELLED);

        long completedCount = completed.size();

        // Each completed, matched trip represents at least one other student who
        // didn't need to take a separate vehicle for that leg of the journey.
        double estimatedSoloTripsAvoided = completedCount;

        return DashboardResponse.builder()
                .activeTrips(active)
                .matchedTrips(matched)
                .completedTrips(completed)
                .cancelledTrips(cancelled)
                .matches(matchingService.getMatchesForUser(userId))
                .totalTripsPosted(allTrips.size())
                .totalCompletedRides(completedCount)
                .estimatedSoloTripsAvoided(estimatedSoloTripsAvoided)
                .build();
    }

    private List<TripResponse> filterAndMap(List<Trip> trips, TripStatus status) {
        return trips.stream()
                .filter(t -> t.getStatus() == status)
                .map(tripMapper::toResponse)
                .toList();
    }
}
