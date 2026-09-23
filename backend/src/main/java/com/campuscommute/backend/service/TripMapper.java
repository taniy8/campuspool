package com.campuscommute.backend.service;

import com.campuscommute.backend.dto.trip.TripResponse;
import com.campuscommute.backend.entity.Trip;
import org.springframework.stereotype.Component;

@Component
public class TripMapper {

    public TripResponse toResponse(Trip trip) {
        return TripResponse.builder()
                .id(trip.getId())
                .userId(trip.getUser().getId())
                .userFullName(trip.getUser().getFullName())
                .tripType(trip.getTripType())
                .originLabel(trip.getOriginLabel())
                .originLat(trip.getOriginLat())
                .originLng(trip.getOriginLng())
                .destinationLabel(trip.getDestinationLabel())
                .destinationLat(trip.getDestinationLat())
                .destinationLng(trip.getDestinationLng())
                .departureTime(trip.getDepartureTime())
                .availableSeats(trip.getAvailableSeats())
                .notes(trip.getNotes())
                .status(trip.getStatus())
                .build();
    }
}
