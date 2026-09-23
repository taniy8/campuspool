package com.campuscommute.backend.controller;

import com.campuscommute.backend.dto.common.ApiResponse;
import com.campuscommute.backend.dto.common.DashboardResponse;
import com.campuscommute.backend.security.CustomUserDetails;
import com.campuscommute.backend.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<DashboardResponse>> getDashboard(
            @AuthenticationPrincipal CustomUserDetails principal
    ) {
        return ResponseEntity.ok(ApiResponse.of("Ride history dashboard", dashboardService.getDashboard(principal.getUserId())));
    }
}
