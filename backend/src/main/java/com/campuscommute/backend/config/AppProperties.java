package com.campuscommute.backend.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;

import java.util.List;

@Getter
@Setter
@ConfigurationProperties(prefix = "app")
public class AppProperties {

    /** College email domains allowed to register, e.g. "college.edu". */
    private List<String> allowedEmailDomains;

    private Matching matching = new Matching();
    private Frontend frontend = new Frontend();
    private Cors cors = new Cors();

    @Getter
    @Setter
    public static class Matching {
        private double maxDistanceKm;
        private int maxTimeWindowMinutes;
    }

    @Getter
    @Setter
    public static class Frontend {
        private String baseUrl;
    }

    @Getter
    @Setter
    public static class Cors {
        private List<String> allowedOrigins;
    }
}
