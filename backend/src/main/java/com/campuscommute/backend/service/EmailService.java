package com.campuscommute.backend.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

/**
 * Thin wrapper around JavaMailSender. In dev/prototype mode (no SMTP credentials
 * configured) this just logs the email instead of failing, so the rest of the
 * registration flow can be tested without a real mail server.
 */
@Service
@Slf4j
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    public void sendVerificationEmail(String to, String fullName, String verificationLink) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(to);
            message.setSubject("Verify your Campus Commute account");
            message.setText(
                    "Hi " + fullName + ",\n\n" +
                    "Welcome to Campus Commute! Please verify your college email by clicking the link below:\n\n" +
                    verificationLink + "\n\n" +
                    "This link expires in 24 hours.\n\n" +
                    "If you didn't sign up, you can ignore this email."
            );
            mailSender.send(message);
        } catch (Exception ex) {
            log.warn("Could not send verification email to {} (SMTP not configured?). " +
                    "Verification link: {}", to, verificationLink);
        }
    }
}
