package com.biovizion.prestamo911.DTOs.Currency;

import java.math.BigDecimal;
import java.time.LocalDate;

import lombok.Data;

public class CurrencyRequestDTOs {
    @Data
    public static class IngresoRequest{
        private BigDecimal monto;

        private String motivo;
        private String tipo;

        private LocalDate fecha;
    }

    @Data
    public static class EgresoRequest{
        private BigDecimal monto;
        
        private String motivo;
        private String tipo;

        private LocalDate fecha;
    }
}
