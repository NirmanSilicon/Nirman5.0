package com.travira.travira.controller;

import com.travira.travira.entity.Expense;
import com.travira.travira.entity.Trip;
import com.travira.travira.service.ExpenseService;
import com.travira.travira.service.TripService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api")
public class ExpenseController {

    private final ExpenseService expenseService;
    private final TripService tripService;

    @Value("${file.upload-dir:uploads}")
    private String uploadDir;

    public ExpenseController(ExpenseService expenseService, TripService tripService) {
        this.expenseService = expenseService;
        this.tripService = tripService;
    }

    @GetMapping("/trips/{tripId}/expenses")
    public ResponseEntity<?> getExpenses(@PathVariable Long tripId) {
        Trip trip = tripService.getTripById(tripId);
        if (trip == null) {
            return ResponseEntity.notFound().build();
        }
        List<Expense> expenses = expenseService.getExpensesForTrip(trip);
        return ResponseEntity.ok(expenses);
    }

    @PostMapping(
            value = "/expenses/upload",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> uploadReceipt(@RequestPart("file") MultipartFile file)
            throws IOException {

        if (file.isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "File is empty"));
        }

        File dir = new File(uploadDir);
        if (!dir.exists()) {
            dir.mkdirs();
        }

        String ext = "";
        String originalName = file.getOriginalFilename();
        if (originalName != null && originalName.contains(".")) {
            ext = originalName.substring(originalName.lastIndexOf("."));
        }

        String filename = UUID.randomUUID() + ext;
        File dest = new File(dir, filename);
        file.transferTo(dest);

        return ResponseEntity.ok(Map.of(
                "message", "Receipt uploaded successfully",
                "fileName", filename,
                "path", dest.getAbsolutePath()
        ));
    }

    @PostMapping("/trips/{tripId}/expenses")
    public ResponseEntity<?> createExpense(@PathVariable Long tripId,
                                           @RequestBody Map<String, Object> body) {
        Trip trip = tripService.getTripById(tripId);
        if (trip == null) return ResponseEntity.notFound().build();

        Expense expense = new Expense();
        expense.setTrip(trip);
        expense.setDescription((String) body.getOrDefault("description", "Expense"));
        Object amountObj = body.get("amount");
        expense.setAmount(amountObj == null ? 0.0 : Double.parseDouble(amountObj.toString()));
        expense.setPaidBy((String) body.getOrDefault("paidBy", "Unknown"));
        expense.setDate(LocalDate.now());
        expense.setReceiptPath(null);

        Expense saved = expenseService.save(expense);
        return ResponseEntity.ok(saved);
    }
}
