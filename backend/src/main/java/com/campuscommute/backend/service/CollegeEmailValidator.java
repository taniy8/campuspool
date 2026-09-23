package com.campuscommute.backend.service;

import com.campuscommute.backend.config.AppProperties;
import com.campuscommute.backend.exception.InvalidCollegeEmailException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

/**
 * Restricts registration to whitelisted college email domains. This is the core
 * "trusted, student-only environment" safety mechanism the platform relies on
 * instead of manual ID verification.
 */
@Component
@RequiredArgsConstructor
public class CollegeEmailValidator {

    private final AppProperties appProperties;

    public void validate(String email) {
        String domain = extractDomain(email);

        boolean allowed = appProperties.getAllowedEmailDomains().stream()
                .anyMatch(allowedDomain -> allowedDomain.equalsIgnoreCase(domain));

        if (!allowed) {
            throw new InvalidCollegeEmailException(
                    "Registration is restricted to college email addresses. Allowed domains: "
                            + String.join(", ", appProperties.getAllowedEmailDomains())
            );
        }
    }

    private String extractDomain(String email) {
        int at = email.indexOf('@');
        if (at < 0 || at == email.length() - 1) {
            throw new InvalidCollegeEmailException("Invalid email address");
        }
        return email.substring(at + 1).trim();
    }
}
