package com.biovizion.prestamo911.DTOs;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

public class HistorialDTOs {
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class HistorialTablaDTO {
        private Long id;
        private String usuario;
        private String accion;
        private LocalDateTime fechaAccion;
    }
}