package com.campuscommute.backend.dto.trip;

import com.campuscommute.backend.enums.TripStatus;
import com.campuscommute.backend.enums.TripType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TripResponse {
    private Long id;
    private Long userId;
    private String userFullName;
    private TripType tripType;
    private String originLabel;
    private Double originLat;
    private Double originLng;
    private String destinationLabel;
    private Double destinationLat;
    private Double destinationLng;
    private LocalDateTime departureTime;
    private Integer availableSeats;
    private String notes;
    private TripStatus status;
}
