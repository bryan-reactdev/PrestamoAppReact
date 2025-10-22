package com.biovizion.prestamo911;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.security.core.Authentication;


import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Collection;

@Component
public class CustomAuth implements AuthenticationSuccessHandler {

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws IOException, ServletException {
        String redirectURL = request.getContextPath();

        System.out.println("LOGIN EXITOSO");
        System.out.println("Usuario autenticado: " + authentication.getName());
        System.out.println("Detalles del auth: " + authentication);

        Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();
        boolean matched = false;

        if (authorities.isEmpty()) {
            System.out.println("NO TIENE ROLES ASIGNADOS");
        }

        for (GrantedAuthority authority : authorities) {
            System.out.println("ROL AUTENTICADO: " + authority.getAuthority());
            String rol = authority.getAuthority();
            if (rol.equals("ROLE_ADMIN") || rol.equals("ROLE_COBRADOR") || rol.equals("ROLE_SECRETARIA") || rol.equals("ROLE_GERENTE")) {
                redirectURL += "/admin/panel";
                matched = true;
                break;
            } else if (rol.equals("ROLE_USER")) {
                redirectURL += "/usuario/panel";
                matched = true;
                break;
            }
        }

        if (!matched) {
            System.out.println("NO SE MATCHEÓ NINGÚN ROL");
            redirectURL += "/default-dashboard";
        }

        System.out.println("REDIRECCIÓN A: " + redirectURL);
        response.sendRedirect(redirectURL);
    }
}
