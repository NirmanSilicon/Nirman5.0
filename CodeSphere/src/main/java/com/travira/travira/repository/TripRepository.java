package com.travira.travira.repository;

import com.travira.travira.entity.Trip;
import com.travira.travira.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TripRepository extends JpaRepository<Trip, Long> {
    List<Trip> findByOwner(User owner);
}
