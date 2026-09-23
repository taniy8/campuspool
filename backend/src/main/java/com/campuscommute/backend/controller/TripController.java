package com.campuscommute.backend.controller;

import com.campuscommute.backend.dto.common.ApiResponse;
import com.campuscommute.backend.dto.trip.TripRequest;
import com.campuscommute.backend.dto.trip.TripResponse;
import com.campuscommute.backend.security.CustomUserDetails;
import com.campuscommute.backend.service.TripService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/trips")
@RequiredArgsConstructor
public class TripController {

    private final TripService tripService;

    public TripController(TripService tripService) {
        this.tripService = tripService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<TripResponse>> postTrip(
            @AuthenticationPrincipal CustomUserDetails principal,
            @Valid @RequestBody TripRequest request
    ) {
        TripResponse response = tripService.postTrip(principal.getUserId(), request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.of("Trip posted. We'll surface any matches shortly.", response));
    }

    @GetMapping("/{tripId}")
    public ResponseEntity<ApiResponse<TripResponse>> getTrip(@PathVariable Long tripId) {
        return ResponseEntity.ok(ApiResponse.of("Trip fetched", tripService.getTrip(tripId)));
    }

    @GetMapping("/mine")
    public ResponseEntity<ApiResponse<List<TripResponse>>> getMyTrips(
            @AuthenticationPrincipal CustomUserDetails principal
    ) {
        return ResponseEntity.ok(ApiResponse.of("Your trips", tripService.getMyTrips(principal.getUserId())));
    }

    @GetMapping("/active")
    public ResponseEntity<ApiResponse<List<TripResponse>>> getActiveTrips() {
        return ResponseEntity.ok(ApiResponse.of("Active trips", tripService.getActiveTrips()));
    }

    @PatchMapping("/{tripId}/cancel")
    public ResponseEntity<ApiResponse<TripResponse>> cancelTrip(
            @AuthenticationPrincipal CustomUserDetails principal,
            @PathVariable Long tripId
    ) {
        TripResponse response = tripService.cancelTrip(principal.getUserId(), tripId);
        return ResponseEntity.ok(ApiResponse.of("Trip cancelled", response));
    }

    @PatchMapping("/{tripId}/complete")
    public ResponseEntity<ApiResponse<TripResponse>> completeTrip(
            @AuthenticationPrincipal CustomUserDetails principal,
            @PathVariable Long tripId
    ) {
        TripResponse response = tripService.completeTrip(principal.getUserId(), tripId);
        return ResponseEntity.ok(ApiResponse.of("Trip marked as completed", response));
    }
}
