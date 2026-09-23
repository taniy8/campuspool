package com.campuscommute.backend.entity;

import com.campuscommute.backend.enums.MatchStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

/**
 * A suggested (or confirmed) pairing between two trips that the matching engine
 * determined are close enough in route and time to share a ride.
 */
@Entity
@Table(name = "trip_matches", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"trip_a_id", "trip_b_id"})
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TripMatch {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "trip_a_id", nullable = false)
    private Trip tripA;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "trip_b_id", nullable = false)
    private Trip tripB;

    // Straight-line distance in km between the two trips' origin points
    @Column(nullable = false)
    private Double originDistanceKm;

    // Straight-line distance in km between the two trips' destination points
    @Column(nullable = false)
    private Double destinationDistanceKm;

    // Absolute difference in departure time, in minutes
    @Column(nullable = false)
    private Long timeDifferenceMinutes;

    // Composite score, 0-100, higher = better match. Used for ranking.
    @Column(nullable = false)
    private Double matchScore;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private MatchStatus status = MatchStatus.SUGGESTED;

    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = Instant.now();
    }
}
