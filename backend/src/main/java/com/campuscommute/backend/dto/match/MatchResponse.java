package com.campuscommute.backend.dto.match;

import com.campuscommute.backend.dto.trip.TripResponse;
import com.campuscommute.backend.enums.MatchStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MatchResponse {
    private Long matchId;
    private TripResponse myTrip;
    private TripResponse matchedTrip;
    private Double originDistanceKm;
    private Double destinationDistanceKm;
    private Long timeDifferenceMinutes;
    private Double matchScore;
    private MatchStatus status;
}
