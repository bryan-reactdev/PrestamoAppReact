package com.biovizion.prestamo911.utils;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.Authentication;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.stereotype.Component;

import com.biovizion.prestamo911.entities.UsuarioAccionEntity;
import com.biovizion.prestamo911.entities.UsuarioEntity;
import com.biovizion.prestamo911.service.UsuarioAccionService;
import com.biovizion.prestamo911.service.UsuarioService;

import java.util.Optional;

@Component
public class AccionLogger {
    
    @Autowired
    private UsuarioAccionService usuarioAccionService;
    
    @Autowired
    private UsuarioService usuarioService;
    
    /**
     * Logs a user action. Gets the current authenticated user and logs the action.
     * @param accion The action type
     * @param usuarioAfectado The user affected by the action (can be null for actions that don't affect a specific user)
     */
    public void logAccion(AccionTipo accion, UsuarioEntity usuarioAfectado) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            
            // Skip logging if not authenticated or anonymous
            if (authentication == null || !authentication.isAuthenticated() || 
                authentication instanceof AnonymousAuthenticationToken) {
                return;
            }
            
            String username = authentication.getName();
            Optional<UsuarioEntity> usuarioOpt = usuarioService.findByDui(username);
            
            if (usuarioOpt.isEmpty()) {
                return;
            }
            
            UsuarioEntity usuario = usuarioOpt.get();
            
            // For actions that require a usuarioAfectado, use the provided one
            // For actions that don't require one, use the same user as both usuario and usuarioAfectado
            UsuarioEntity usuarioAfectadoFinal = usuarioAfectado != null ? usuarioAfectado : usuario;
            
            UsuarioAccionEntity usuarioAccion = UsuarioAccionEntity.builder()
                .accion(accion)
                .usuario(usuario)
                .usuarioAfectado(usuarioAfectadoFinal)
                .build();
            
            usuarioAccionService.save(usuarioAccion);
        } catch (Exception e) {
            // Silently fail - don't break the main operation if logging fails
            System.err.println("Error logging action: " + e.getMessage());
        }
    }
    
    /**
     * Logs a user action with a specific affected user by ID
     * @param accion The action type
     * @param usuarioAfectadoId The ID of the user affected by the action
     */
    public void logAccion(AccionTipo accion, Long usuarioAfectadoId) {
        if (usuarioAfectadoId == null) {
            logAccion(accion, (UsuarioEntity) null);
            return;
        }
        
        Optional<UsuarioEntity> usuarioAfectadoOpt = usuarioService.findById(usuarioAfectadoId);
        logAccion(accion, usuarioAfectadoOpt.orElse(null));
    }
}

