package com.biovizion.prestamo911.utils;

import org.springframework.stereotype.Component;

import com.biovizion.prestamo911.entities.UsuarioAccionEntity;
import com.biovizion.prestamo911.entities.UsuarioEntity;

@Component
public class AccionResolver {
    public static String resolveAccion(UsuarioAccionEntity usuarioAccion) {
        try {
            String descripcion = usuarioAccion.getAccion().getDescripcion();
            
            // Only append user name if the description ends with ": " (indicating it expects a user name)
            if (usuarioAccion.getUsuarioAfectado() != null && descripcion.endsWith(": ")){
                UsuarioEntity usuarioAfectado = usuarioAccion.getUsuarioAfectado();
                String usuarioAfectadoNombreCompleto = (usuarioAfectado.getNombre() + ' ' + usuarioAfectado.getApellido());

                return descripcion + usuarioAfectadoNombreCompleto;
            }
            
            return descripcion;
        } catch (IllegalArgumentException e) {
            return "Acción desconocida";
        }
    }
}