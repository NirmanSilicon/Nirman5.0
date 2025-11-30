package com.travira.travira.service;

import com.travira.travira.entity.Expense;
import com.travira.travira.entity.Trip;
import com.travira.travira.repository.ExpenseRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ExpenseService {

    private final ExpenseRepository expenseRepository;

    public ExpenseService(ExpenseRepository expenseRepository) {
        this.expenseRepository = expenseRepository;
    }

    public List<Expense> getExpensesForTrip(Trip trip) {
        return expenseRepository.findByTrip(trip);
    }

    public Expense save(Expense expense) {
        return expenseRepository.save(expense);
    }
}
