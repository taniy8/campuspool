package com.campuscommute.backend.repository;

import com.campuscommute.backend.entity.Trip;
import com.campuscommute.backend.enums.TripStatus;
import com.campuscommute.backend.enums.TripType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface TripRepository extends JpaRepository<Trip, Long> {

    List<Trip> findByUserIdOrderByDepartureTimeDesc(Long userId);

    List<Trip> findByStatus(TripStatus status);

    /**
     * Candidate pool for the matching engine: other students' active trips of the
     * same type (TO_CAMPUS / FROM_CAMPUS) within a departure-time window, excluding
     * the trip's own owner. Fine-grained distance filtering happens in the service
     * layer using the Haversine formula, since lat/lng proximity isn't expressible
     * cleanly in JPQL without PostGIS.
     */
    List<Trip> findByTripTypeAndStatusAndUserIdNotAndDepartureTimeBetween(
            TripType tripType,
            TripStatus status,
            Long excludedUserId,
            LocalDateTime from,
            LocalDateTime to
    );
}
