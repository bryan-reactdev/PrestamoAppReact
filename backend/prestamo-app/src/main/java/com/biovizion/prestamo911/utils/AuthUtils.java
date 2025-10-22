package com.biovizion.prestamo911.utils;

import org.springframework.security.core.context.SecurityContextHolder;

public class AuthUtils {
    public static String getUsername() {
        return SecurityContextHolder.getContext().getAuthentication().getName();
    }

    public static boolean hasRole(String role) {
        return SecurityContextHolder.getContext().getAuthentication().getAuthorities()
                .stream()
                .anyMatch(a -> a.getAuthority().equals(role));
    }
}
