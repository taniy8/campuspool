package com.campuscommute.backend.service;

import com.campuscommute.backend.dto.trip.TripRequest;
import com.campuscommute.backend.dto.trip.TripResponse;
import com.campuscommute.backend.entity.Trip;
import com.campuscommute.backend.entity.User;
import com.campuscommute.backend.enums.TripStatus;
import com.campuscommute.backend.exception.ResourceNotFoundException;
import com.campuscommute.backend.exception.UnauthorizedActionException;
import com.campuscommute.backend.repository.TripRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TripService {

    private final TripRepository tripRepository;
    private final UserService userService;
    private final TripMapper tripMapper;
    private final MatchingService matchingService;

    @Transactional
    public TripResponse postTrip(Long userId, TripRequest request) {
        User user = userService.getById(userId);

        Trip trip = Trip.builder()
                .user(user)
                .tripType(request.getTripType())
                .originLabel(request.getOriginLabel())
                .originLat(request.getOriginLat())
                .originLng(request.getOriginLng())
                .destinationLabel(request.getDestinationLabel())
                .destinationLat(request.getDestinationLat())
                .destinationLng(request.getDestinationLng())
                .departureTime(request.getDepartureTime())
                .availableSeats(request.getAvailableSeats() != null ? request.getAvailableSeats() : 3)
                .notes(request.getNotes())
                .status(TripStatus.ACTIVE)
                .build();

        trip = tripRepository.save(trip);

        // Kick off matching immediately so the poster sees suggestions right away.
        matchingService.generateMatchesForTrip(trip);

        return tripMapper.toResponse(trip);
    }

    public TripResponse getTrip(Long tripId) {
        return tripMapper.toResponse(findTripOrThrow(tripId));
    }

    public List<TripResponse> getMyTrips(Long userId) {
        return tripRepository.findByUserIdOrderByDepartureTimeDesc(userId).stream()
                .map(tripMapper::toResponse)
                .toList();
    }

    public List<TripResponse> getActiveTrips() {
        return tripRepository.findByStatus(TripStatus.ACTIVE).stream()
                .map(tripMapper::toResponse)
                .toList();
    }

    @Transactional
    public TripResponse cancelTrip(Long userId, Long tripId) {
        Trip trip = findTripOrThrow(tripId);

        if (!trip.getUser().getId().equals(userId)) {
            throw new UnauthorizedActionException("You can only cancel your own trips");
        }

        trip.setStatus(TripStatus.CANCELLED);
        trip = tripRepository.save(trip);

        return tripMapper.toResponse(trip);
    }

    @Transactional
    public TripResponse completeTrip(Long userId, Long tripId) {
        Trip trip = findTripOrThrow(tripId);

        if (!trip.getUser().getId().equals(userId)) {
            throw new UnauthorizedActionException("You can only update your own trips");
        }

        trip.setStatus(TripStatus.COMPLETED);
        trip = tripRepository.save(trip);

        return tripMapper.toResponse(trip);
    }

    Trip findTripOrThrow(Long tripId) {
        return tripRepository.findById(tripId)
                .orElseThrow(() -> new ResourceNotFoundException("Trip not found with id: " + tripId));
    }
}
