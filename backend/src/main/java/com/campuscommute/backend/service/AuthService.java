package com.campuscommute.backend.service;

import com.campuscommute.backend.config.AppProperties;
import com.campuscommute.backend.dto.auth.AuthResponse;
import com.campuscommute.backend.dto.auth.LoginRequest;
import com.campuscommute.backend.dto.auth.RegisterRequest;
import com.campuscommute.backend.entity.User;
import com.campuscommute.backend.entity.VerificationToken;
import com.campuscommute.backend.enums.Role;
import com.campuscommute.backend.exception.BadRequestException;
import com.campuscommute.backend.exception.ResourceNotFoundException;
import com.campuscommute.backend.repository.UserRepository;
import com.campuscommute.backend.repository.VerificationTokenRepository;
import com.campuscommute.backend.security.CustomUserDetails;
import com.campuscommute.backend.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final VerificationTokenRepository verificationTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final CollegeEmailValidator collegeEmailValidator;
    private final EmailService emailService;
    private final AppProperties appProperties;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        String email = request.getEmail().trim().toLowerCase();

        collegeEmailValidator.validate(email);

        if (userRepository.existsByEmail(email)) {
            throw new BadRequestException("An account with this email already exists");
        }

        User user = User.builder()
                .fullName(request.getFullName().trim())
                .email(email)
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .phoneNumber(request.getPhoneNumber())
                .collegeName(request.getCollegeName())
                .role(Role.STUDENT)
                .emailVerified(false)
                .enabled(true)
                .build();

        user = userRepository.save(user);

        issueVerificationToken(user);

        String accessToken = jwtUtil.generateAccessToken(user.getEmail(), user.getId());

        return AuthResponse.builder()
                .accessToken(accessToken)
                .tokenType("Bearer")
                .userId(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .emailVerified(user.isEmailVerified())
                .build();
    }

    @Transactional
    public void issueVerificationToken(User user) {
        String token = UUID.randomUUID().toString();

        VerificationToken verificationToken = VerificationToken.builder()
                .token(token)
                .user(user)
                .expiresAt(Instant.now().plus(24, ChronoUnit.HOURS))
                .used(false)
                .build();

        verificationTokenRepository.save(verificationToken);

        String link = appProperties.getFrontend().getBaseUrl() + "/verify-email?token=" + token;
        emailService.sendVerificationEmail(user.getEmail(), user.getFullName(), link);
    }

    @Transactional
    public void verifyEmail(String token) {
        VerificationToken verificationToken = verificationTokenRepository.findByToken(token)
                .orElseThrow(() -> new BadRequestException("Invalid verification token"));

        if (verificationToken.isUsed()) {
            throw new BadRequestException("This verification link has already been used");
        }
        if (verificationToken.isExpired()) {
            throw new BadRequestException("This verification link has expired. Please request a new one.");
        }

        User user = verificationToken.getUser();
        user.setEmailVerified(true);
        userRepository.save(user);

        verificationToken.setUsed(true);
        verificationTokenRepository.save(verificationToken);
    }

    public AuthResponse login(LoginRequest request) {
        String email = request.getEmail().trim().toLowerCase();

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email, request.getPassword())
        );

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        String accessToken = jwtUtil.generateAccessToken(user.getEmail(), user.getId());

        return AuthResponse.builder()
                .accessToken(accessToken)
                .tokenType("Bearer")
                .userId(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .emailVerified(user.isEmailVerified())
                .build();
    }

    public static Long currentUserId(CustomUserDetails principal) {
        return principal.getUserId();
    }
}
