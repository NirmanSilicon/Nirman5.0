package com.travira.travira.controller;

import com.travira.travira.dto.TripRequest;
import com.travira.travira.entity.Trip;
import com.travira.travira.entity.User;
import com.travira.travira.repository.UserRepository;
import com.travira.travira.service.TripService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/trips")
@CrossOrigin(origins = "http://localhost:5173")
public class TripController {

    private final TripService tripService;
    private final UserRepository userRepository;

    public TripController(TripService tripService, UserRepository userRepository) {
        this.tripService = tripService;
        this.userRepository = userRepository;
    }


    // ===================== FETCH ALL TRIPS =====================
    @GetMapping
    public ResponseEntity<List<Trip>> getTrips(Authentication auth) {
        User user = userRepository.findByEmail(auth.getName()).orElseThrow();
        return ResponseEntity.ok(tripService.getTripsForUser(user));
    }


    // ===================== CREATE TRIP =====================
    // Frontend → POST http://localhost:8080/api/trips
    @PostMapping
    public ResponseEntity<?> createTrip(@RequestBody TripRequest request, Authentication auth) {
        User user = userRepository.findByEmail(auth.getName()).orElseThrow();
        Trip trip = tripService.createTripForUser(request, user);
        return ResponseEntity.ok(trip);
    }


    // ===================== UPDATE TRIP =====================
    // Frontend → PUT http://localhost:8080/api/trips/{id}
    @PutMapping("/{id}")
    public ResponseEntity<?> updateTrip(@PathVariable Long id,
                                        @RequestBody TripRequest request,
                                        Authentication auth) {
        User user = userRepository.findByEmail(auth.getName()).orElseThrow();
        Trip updated = tripService.updateTrip(id, request, user);

        return ResponseEntity.ok(updated);
    }


    // ===================== DELETE TRIP =====================
    // Frontend → DELETE http://localhost:8080/api/trips/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTrip(@PathVariable Long id, Authentication auth) {
        User user = userRepository.findByEmail(auth.getName()).orElseThrow();
        tripService.deleteTrip(id, user);

        return ResponseEntity.ok("Trip deleted successfully ✔");
    }
}
