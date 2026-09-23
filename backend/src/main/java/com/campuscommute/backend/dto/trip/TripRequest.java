package com.campuscommute.backend.dto.trip;

import com.campuscommute.backend.enums.TripType;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TripRequest {

    @NotNull(message = "Trip type (TO_CAMPUS / FROM_CAMPUS) is required")
    private TripType tripType;

    @NotBlank
    @Size(max = 200)
    private String originLabel;

    @NotNull
    @DecimalMin(value = "-90.0") @DecimalMax(value = "90.0")
    private Double originLat;

    @NotNull
    @DecimalMin(value = "-180.0") @DecimalMax(value = "180.0")
    private Double originLng;

    @NotBlank
    @Size(max = 200)
    private String destinationLabel;

    @NotNull
    @DecimalMin(value = "-90.0") @DecimalMax(value = "90.0")
    private Double destinationLat;

    @NotNull
    @DecimalMin(value = "-180.0") @DecimalMax(value = "180.0")
    private Double destinationLng;

    @NotNull(message = "Departure time is required")
    @Future(message = "Departure time must be in the future")
    private LocalDateTime departureTime;

    @Min(1) @Max(8)
    private Integer availableSeats;

    @Size(max = 500)
    private String notes;
}
