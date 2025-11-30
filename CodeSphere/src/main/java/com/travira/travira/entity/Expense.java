package com.travira.travira.entity;


import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Setter
@Getter
@Entity
@Table(name = "expenses")
public class Expense {

    // getters & setters
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String description;
    private Double amount;
    private String paidBy;
    private LocalDate date;
    private String receiptPath;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "trip_id")
    private Trip trip;

    public Expense() {}

    public Expense(String description, Double amount, String paidBy,
                   LocalDate date, String receiptPath, Trip trip) {
        this.description = description;
        this.amount = amount;
        this.paidBy = paidBy;
        this.date = date;
        this.receiptPath = receiptPath;
        this.trip = trip;
    }

}
