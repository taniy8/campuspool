package com.campuscommute.backend.controller;

import com.campuscommute.backend.dto.common.ApiResponse;
import com.campuscommute.backend.dto.common.UserResponse;
import com.campuscommute.backend.entity.User;
import com.campuscommute.backend.security.CustomUserDetails;
import com.campuscommute.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserResponse>> getCurrentUser(
            @AuthenticationPrincipal CustomUserDetails principal
    ) {
        User user = userService.getById(principal.getUserId());
        UserResponse response = UserResponse.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .phoneNumber(user.getPhoneNumber())
                .collegeName(user.getCollegeName())
                .emailVerified(user.isEmailVerified())
                .build();
        return ResponseEntity.ok(ApiResponse.of("Current user", response));
    }
}
