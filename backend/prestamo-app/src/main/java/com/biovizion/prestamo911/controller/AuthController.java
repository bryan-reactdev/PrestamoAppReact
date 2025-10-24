package com.biovizion.prestamo911.controller;

import static com.biovizion.prestamo911.DTOs.Usuario.UsuarioDTOs.mapearAUsuarioDTO;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.biovizion.prestamo911.DTOs.GlobalDTOs.ApiResponse;
import com.biovizion.prestamo911.DTOs.Usuario.UsuarioDTOs.UsuarioDTO;
import com.biovizion.prestamo911.entities.UsuarioEntity;
import com.biovizion.prestamo911.service.UsuarioService;
import com.biovizion.prestamo911.utils.FileUtils;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import lombok.Data;

@RestController
@RequestMapping("/auth")
public class AuthController {
    @Autowired
    UsuarioService usuarioService;

    @Autowired 
    PasswordEncoder passwordEncoder;

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

            ApiResponse<UsuarioDTO> response = new ApiResponse<>("Exitosamente autenticado", usuario) ;

            return ResponseEntity.ok(response);
        } catch (AuthenticationException e) {
            e.printStackTrace();
            
            ApiResponse<String> response = new ApiResponse<>("Estas credenciales son erroneas.");
            return ResponseEntity.status(401).body(response);
        }
        catch (Exception e) {
            e.printStackTrace();

            ApiResponse<String> response = new ApiResponse<>("Error al iniciar sesión: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }
    
    @PostMapping(value = "/register", consumes = "multipart/form-data")
    public ResponseEntity<ApiResponse> register(@ModelAttribute RegisterRequest registerRequest, HttpServletRequest request) {
        try {
            Optional<UsuarioEntity> existing = usuarioService.findByDui(registerRequest.getDui());
            if (existing.isPresent()) {
                // No especificar que es debido al DUI
                ApiResponse<String> response = new ApiResponse<>("Un usuario con esta información ya existe.");
                return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
            }

            UsuarioEntity usuario = new UsuarioEntity();
            usuario.setNombre(registerRequest.getNombres());
            usuario.setApellido(registerRequest.getApellidos());
            usuario.setEmail(registerRequest.getEmail());
            usuario.setCelular(registerRequest.getCelular());
            usuario.setDui(registerRequest.getDui());
            usuario.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
            usuario.setRol("USER");

            // --- Use helper for file updates ---
            FileUtils.tryUploadFotoDUI(usuario, "delante", registerRequest.getDuiDelante());
            FileUtils.tryUploadFotoDUI(usuario, "atras", registerRequest.getDuiAtras());

            usuarioService.save(usuario);

            UsuarioDTO usuarioDTO = mapearAUsuarioDTO(usuario);

            ApiResponse<UsuarioDTO> response = new ApiResponse<>("Exitosamente registrado", usuarioDTO) ;

            return ResponseEntity.ok(response);
        }
        catch (Exception e) {
            e.printStackTrace();

            ApiResponse<String> response = new ApiResponse<>("Error al registrar: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }
    
    @Data
    public static class LoginRequest {
        private String username;
        private String password;
    }

    @Data
    public static class RegisterRequest {
        private String nombres;
        private String apellidos;
        private String email;
        private String celular;
        private String dui;
        private String password;
        private MultipartFile duiDelante;
        private MultipartFile duiAtras;
    }
}
