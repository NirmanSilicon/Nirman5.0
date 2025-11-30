package com.travira.travira.controller;

import com.travira.travira.repository.TripRepository;
import com.travira.travira.repository.UserRepository;
import com.travira.travira.repository.ExpenseRepository;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "*")
public class DashboardController {

    private final TripRepository tripRepo;
    private final UserRepository userRepo;
    private final ExpenseRepository expenseRepo;

    public DashboardController(TripRepository tripRepo, UserRepository userRepo, ExpenseRepository expenseRepo) {
        this.tripRepo = tripRepo;
        this.userRepo = userRepo;
        this.expenseRepo = expenseRepo;
    }

    @GetMapping("/stats")
    public Map<String, Object> getStats() {
        Map<String, Object> response = new HashMap<>();

        // Active trips count
        response.put("activeTrips", tripRepo.count());

        // Members count
        response.put("totalMembers", userRepo.count());

        // Total expense sum
        Double totalAmount = expenseRepo.findAll().stream()
                .mapToDouble(e -> e.getAmount())
                .sum();

        response.put("totalExpenses", totalAmount);
        response.put("savings", totalAmount * 0.15); // example AI-based savings

        return response;
    }
}
