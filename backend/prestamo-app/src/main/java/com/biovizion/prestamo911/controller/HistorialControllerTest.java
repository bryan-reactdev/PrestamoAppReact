package com.biovizion.prestamo911.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import com.biovizion.prestamo911.DTOs.GlobalDTOs.ApiResponse;
import com.biovizion.prestamo911.DTOs.HistorialDTOs.HistorialTablaDTO;
import com.biovizion.prestamo911.entities.UsuarioAccionEntity;
import com.biovizion.prestamo911.service.UsuarioAccionService;
import com.biovizion.prestamo911.utils.AccionResolver;

import org.springframework.web.bind.annotation.GetMapping;

@Controller
@RequestMapping("/historialTest")
public class HistorialControllerTest {
    @Autowired
    private UsuarioAccionService usuarioAccionService;

    @GetMapping("/")
    public ResponseEntity<ApiResponse> getHistorial() {
        try {
            List<UsuarioAccionEntity> acciones = usuarioAccionService.findAll();

            List<HistorialTablaDTO> historialDTO = acciones.stream().map(accion -> {
                String usuarioNombre = accion.getUsuario().getNombre().trim() + " " + accion.getUsuario().getApellido().trim();

                return new HistorialTablaDTO(
                    accion.getId(),
                    usuarioNombre,
                    AccionResolver.resolveAccion(accion),
                    accion.getFecha()
                );
            }).collect(Collectors.toList());
            
            ApiResponse<List<HistorialTablaDTO>> response = 
                new ApiResponse<>("FETCH Historial obtenido exitosamente", historialDTO);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            ApiResponse<String> response = new ApiResponse<>("Error al obtener el historial: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }
}