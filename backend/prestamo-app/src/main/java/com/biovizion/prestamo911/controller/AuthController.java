package com.biovizion.prestamo911.controller;

import static com.biovizion.prestamo911.DTOs.Usuario.UsuarioDTOs.mapearAUsuarioDTO;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.biovizion.prestamo911.DTOs.GlobalDTOs.ApiResponse;
import com.biovizion.prestamo911.DTOs.Usuario.UsuarioDTOs.UsuarioDTO;
import com.biovizion.prestamo911.service.UsuarioService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/auth")
public class AuthController {
    @Autowired
    UsuarioService usuarioService;

    private final AuthenticationManager authenticationManager;

    // Only inject AuthenticationManager, not UserDetailsService
    public AuthController(AuthenticationManager authenticationManager) {
        this.authenticationManager = authenticationManager;
    }
    
    @PostMapping("/check")
    public ResponseEntity<ApiResponse> checkSession() {
        try {
            // Get current authentication from SecurityContext
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            
            if (authentication == null || !authentication.isAuthenticated() || 
                authentication instanceof AnonymousAuthenticationToken) {
                
                ApiResponse<String> response = new ApiResponse<>("AUTH FAIL");
                return ResponseEntity.status(401).body(response);
            }
            
            // Get current user
            String username = authentication.getName();
            UsuarioDTO usuario = mapearAUsuarioDTO(usuarioService.findByDui(username).get());

            ApiResponse<UsuarioDTO> response = new ApiResponse<>("AUTH SUCCESS", usuario);
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            e.printStackTrace();
            ApiResponse<String> response = new ApiResponse<>("AUTH ERROR: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse> login(@RequestBody LoginRequest loginRequest, HttpServletRequest request) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword())
            );
            
            SecurityContextHolder.getContext().setAuthentication(authentication);
            
            // Create session
            HttpSession session = request.getSession();
            
            session.setAttribute("SPRING_SECURITY_CONTEXT", SecurityContextHolder.getContext());

            UsuarioDTO usuario = mapearAUsuarioDTO(usuarioService.findByDui(loginRequest.getUsername()).get());

            ApiResponse<UsuarioDTO> response = new ApiResponse<>("Exitosamente logeado", usuario) ;

            return ResponseEntity.ok(response);
        } catch (AuthenticationException e) {
            e.printStackTrace();
            
            ApiResponse<String> response = new ApiResponse<>("Estas credenciales son erroneas.");
            return ResponseEntity.status(401).body(response);
        }
        catch (Exception e) {
            e.printStackTrace();

            ApiResponse<String> response = new ApiResponse<>("Error al obtener las cuotas del crédito: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }
    
    public static class LoginRequest {
        private String username;
        private String password;
        
        // getters and setters
        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }
}
