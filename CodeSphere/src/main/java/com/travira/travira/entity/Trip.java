package com.travira.travira.entity;


import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Setter
@Getter
@Entity
@Table(name = "trips")
public class Trip {

    // getters & setters
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String origin;
    private String destination;
    private LocalDate startDate;
    private LocalDate endDate;
    private int memberCount;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User owner;

    public Trip() {}

    public Trip(String name, String destination, LocalDate startDate,
                LocalDate endDate, Integer memberCount, User owner) {
        this.destination = destination;
        this.startDate = startDate;
        this.endDate = endDate;
        this.memberCount = memberCount;
        this.owner = owner;
    }

}
