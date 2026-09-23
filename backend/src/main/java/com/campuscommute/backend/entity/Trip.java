package com.campuscommute.backend.entity;

import com.campuscommute.backend.enums.TripStatus;
import com.campuscommute.backend.enums.TripType;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.time.LocalDateTime;

/**
 * A trip a student posts, e.g. "I'm leaving my place near X at 8:30am heading to campus".
 * Origin/destination are stored as lat/lng points so the matching engine can compute
 * real distances between two students' routes (Haversine formula), plus free-text
 * labels for display purposes.
 */
@Entity
@Table(name = "trips", indexes = {
        @Index(name = "idx_trip_departure_time", columnList = "departureTime"),
        @Index(name = "idx_trip_status", columnList = "status")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Trip {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private TripType tripType;

    @Column(nullable = false, length = 200)
    private String originLabel;

    @Column(nullable = false)
    private Double originLat;

    @Column(nullable = false)
    private Double originLng;

    @Column(nullable = false, length = 200)
    private String destinationLabel;

    @Column(nullable = false)
    private Double destinationLat;

    @Column(nullable = false)
    private Double destinationLng;

    @Column(nullable = false)
    private LocalDateTime departureTime;

    @Builder.Default
    @Column(nullable = false)
    private Integer availableSeats = 3;

    @Column(length = 500)
    private String notes;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private TripStatus status = TripStatus.ACTIVE;

    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    private Instant updatedAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = Instant.now();
        this.updatedAt = Instant.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = Instant.now();
    }
}
