package com.biovizion.prestamo911.DTOs.Cuota;

import java.math.BigDecimal;
import java.time.LocalDate;

import lombok.Data;

public class CuotaRequestDTOs {
    @Data
    public static class AbonoRequest{
        private BigDecimal monto;

        private LocalDate fecha;
    }
}