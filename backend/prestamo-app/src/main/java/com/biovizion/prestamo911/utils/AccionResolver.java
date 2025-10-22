package com.biovizion.prestamo911.utils;

import org.springframework.stereotype.Component;

import com.biovizion.prestamo911.entities.UsuarioAccionEntity;
import com.biovizion.prestamo911.entities.UsuarioEntity;

@Component
public class AccionResolver {
    public static String resolveAccion(UsuarioAccionEntity usuarioAccion) {
        try {
            if (usuarioAccion.getUsuarioAfectado() != null){
                UsuarioEntity usuarioAfectado = usuarioAccion.getUsuarioAfectado();
                String usuarioAfectadoNombreCompleto = (usuarioAfectado.getNombre() + ' ' + usuarioAfectado.getApellido());

                return usuarioAccion.getAccion().getDescripcion() + usuarioAfectadoNombreCompleto;
            }
            
            return usuarioAccion.getAccion().getDescripcion();
        } catch (IllegalArgumentException e) {
            return "Acción desconocida";
        }
    }
}