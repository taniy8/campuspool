package com.campuscommute.backend.dto.common;

import com.campuscommute.backend.dto.match.MatchResponse;
import com.campuscommute.backend.dto.trip.TripResponse;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

/**
 * Aggregated payload for the ride-history dashboard: every trip the student has
 * posted, split by status, plus every match they're part of. The frontend can
 * render this as-is instead of stitching together three separate calls.
 */
@Getter
@Setter
@AllArgsConstructor
@Builder
public class DashboardResponse {
    private List<TripResponse> activeTrips;
    private List<TripResponse> matchedTrips;
    private List<TripResponse> completedTrips;
    private List<TripResponse> cancelledTrips;
    private List<MatchResponse> matches;
    private long totalTripsPosted;
    private long totalCompletedRides;
    private double estimatedSoloTripsAvoided;
}
