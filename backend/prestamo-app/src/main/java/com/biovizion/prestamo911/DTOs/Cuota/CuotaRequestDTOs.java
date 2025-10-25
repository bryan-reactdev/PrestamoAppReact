package com.biovizion.prestamo911.DTOs.Cuota;

import java.math.BigDecimal;
import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

public class CuotaRequestDTOs {
    @Data
    public static class AbonoRequest{
        private BigDecimal monto;

        private LocalDate fecha;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CuotaEditRequest{
        private Long id;
        private LocalDate fechaVencimiento;
        private LocalDate fechaPagado;
        
        private String estado;
        
        private BigDecimal monto;
        private BigDecimal mora;
    }
}