package com.campuscommute.backend.controller;

import com.campuscommute.backend.dto.common.ApiResponse;
import com.campuscommute.backend.dto.match.MatchResponse;
import com.campuscommute.backend.security.CustomUserDetails;
import com.campuscommute.backend.service.MatchingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/matches")
@RequiredArgsConstructor
public class MatchController {

    private final MatchingService matchingService;

    /** All suggested/accepted matches involving a specific trip. */
    @GetMapping("/trip/{tripId}")
    public ResponseEntity<ApiResponse<List<MatchResponse>>> getMatchesForTrip(@PathVariable Long tripId) {
        return ResponseEntity.ok(
                ApiResponse.of("Matches for trip", matchingService.getMatchesForTrip(tripId))
        );
    }

    /** All matches involving the logged-in student, across all their trips. */
    @GetMapping("/mine")
    public ResponseEntity<ApiResponse<List<MatchResponse>>> getMyMatches(
            @AuthenticationPrincipal CustomUserDetails principal
    ) {
        return ResponseEntity.ok(
                ApiResponse.of("Your matches", matchingService.getMatchesForUser(principal.getUserId()))
        );
    }

    @PatchMapping("/{matchId}/accept")
    public ResponseEntity<ApiResponse<MatchResponse>> acceptMatch(
            @AuthenticationPrincipal CustomUserDetails principal,
            @PathVariable Long matchId
    ) {
        MatchResponse response = matchingService.respondToMatch(principal.getUserId(), matchId, true);
        return ResponseEntity.ok(ApiResponse.of("Match accepted", response));
    }

    @PatchMapping("/{matchId}/reject")
    public ResponseEntity<ApiResponse<MatchResponse>> rejectMatch(
            @AuthenticationPrincipal CustomUserDetails principal,
            @PathVariable Long matchId
    ) {
        MatchResponse response = matchingService.respondToMatch(principal.getUserId(), matchId, false);
        return ResponseEntity.ok(ApiResponse.of("Match rejected", response));
    }
}
