package com.campuscommute.backend.repository;

import com.campuscommute.backend.entity.TripMatch;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface TripMatchRepository extends JpaRepository<TripMatch, Long> {

    @Query("""
           select m from TripMatch m
           where m.tripA.id = :tripId or m.tripB.id = :tripId
           order by m.matchScore desc
           """)
    List<TripMatch> findAllForTrip(@Param("tripId") Long tripId);

    @Query("""
           select m from TripMatch m
           where (m.tripA.id = :tripAId and m.tripB.id = :tripBId)
              or (m.tripA.id = :tripBId and m.tripB.id = :tripAId)
           """)
    Optional<TripMatch> findByTripPair(@Param("tripAId") Long tripAId, @Param("tripBId") Long tripBId);

    @Query("""
           select m from TripMatch m
           where m.tripA.user.id = :userId or m.tripB.user.id = :userId
           order by m.createdAt desc
           """)
    List<TripMatch> findAllForUser(@Param("userId") Long userId);
}
