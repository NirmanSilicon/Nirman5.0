package com.travira.travira.dto;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class AuthResponse {

    private String token;
    private UserDto user;

    public AuthResponse() {}

    public AuthResponse(String token, UserDto user) {
        this.token = token;
        this.user = user;
    }

    @Setter
    @Getter
    public static class UserDto {
        private Long id;
        private String name;
        private String email;

        public UserDto() {}

        public UserDto(Long id, String name, String email) {
            this.id = id;
            this.name = name;
            this.email = email;
        }

    }
}

