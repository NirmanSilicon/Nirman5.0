package com.travira.travira.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;    //  <-- Important for request mapping

@Getter
@Setter
@NoArgsConstructor
public class TripRequest {

    private String origin;          // 🔥 Put origin at top (recommended)
    private String destination;
    private String startDate;
    private String endDate;
    private int memberCount;        // 🔥 This will now update properly
}
