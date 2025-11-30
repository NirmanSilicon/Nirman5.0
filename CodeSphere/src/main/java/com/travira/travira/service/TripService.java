package com.travira.travira.service;

import com.travira.travira.dto.TripRequest;
import com.travira.travira.entity.Trip;
import com.travira.travira.entity.User;
import com.travira.travira.repository.TripRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class TripService {

    private final TripRepository tripRepository;

    // Accept both UI formats yyyy-MM-dd and dd-MM-yyyy
    private static final DateTimeFormatter FORMATTER =
            DateTimeFormatter.ofPattern("dd-MM-yyyy");

    public TripService(TripRepository tripRepository) {
        this.tripRepository = tripRepository;
    }

    // 🔥 Try parsing both formats safely
    private LocalDate toDate(String date) {
        try {
            return LocalDate.parse(date, FORMATTER);
        } catch (Exception e) {
            return LocalDate.parse(date); // yyyy-MM-dd fallback
        }
    }

    // ================= CREATE NEW TRIP =================
    public Trip createTripForUser(TripRequest req, User user) {
        Trip trip = new Trip();

        trip.setOrigin(req.getOrigin());
        trip.setDestination(req.getDestination());
        trip.setStartDate(toDate(req.getStartDate()));
        trip.setEndDate(toDate(req.getEndDate()));
        trip.setMemberCount(req.getMemberCount());
        trip.setOwner(user);

        return tripRepository.save(trip);
    }

    // ================= FETCH USER TRIPS =================
    public List<Trip> getTripsForUser(User user) {
        return tripRepository.findByOwner(user);
    }

    // ================= GET TRIP BY ID =================
    public Trip getTripById(Long id) {
        return tripRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Trip not found"));
    }

    // ================= DELETE TRIP =================
    public void deleteTrip(Long id, User user) {
        Trip trip = getTripById(id);

        if (!trip.getOwner().getId().equals(user.getId()))
            throw new RuntimeException("Unauthorized delete attempt");

        tripRepository.delete(trip);
    }

    // ================= UPDATE TRIP =================
    public Trip updateTrip(Long id, TripRequest req, User user) {
        Trip trip = getTripById(id);

        if (!trip.getOwner().getId().equals(user.getId()))
            throw new RuntimeException("Unauthorized update attempt");

        trip.setOrigin(req.getOrigin());
        trip.setDestination(req.getDestination());
        trip.setStartDate(toDate(req.getStartDate()));
        trip.setEndDate(toDate(req.getEndDate()));
        trip.setMemberCount(req.getMemberCount()); // 🔥 this is the fix

        return tripRepository.save(trip);
    }
}
