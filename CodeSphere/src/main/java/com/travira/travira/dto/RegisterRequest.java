package com.travira.travira.dto;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class RegisterRequest {

    private String name;
    private String email;
    private String password;

    public RegisterRequest() {}

}
