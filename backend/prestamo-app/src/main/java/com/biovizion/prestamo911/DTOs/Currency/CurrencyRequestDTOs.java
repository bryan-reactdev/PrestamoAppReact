package com.biovizion.prestamo911.DTOs.Currency;

import java.math.BigDecimal;
import java.time.LocalDate;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

public class CurrencyRequestDTOs {
    @Data
    public static class IngresoRequest{
        private BigDecimal monto;

        private String motivo;
        private String tipo;

        private LocalDate fecha;

        private MultipartFile[] images;
    }

    @Data
    public static class EgresoRequest{
        private BigDecimal monto;
        
        private String motivo;
        private String tipo;

        private LocalDate fecha;

        private MultipartFile[] images;
    }

    @Data
    public static class HistorialEditRequest{
        private BigDecimal monto;
        private String motivo;
        private String tipo;
        private LocalDate fecha;
        private MultipartFile[] images;
        private String[] existingImages; // Paths of images to keep
    }
}
