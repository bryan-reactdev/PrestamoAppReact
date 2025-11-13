package com.biovizion.prestamo911.DTOs.Currency;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import com.biovizion.prestamo911.DTOs.Credito.CreditoDTOs.CreditoDTO;
import com.biovizion.prestamo911.DTOs.Cuota.CuotaDTOs.AbonoDTO;
import com.biovizion.prestamo911.DTOs.Cuota.CuotaDTOs.CuotaDTO;
import com.biovizion.prestamo911.entities.HistorialBalanceEntity;
import com.biovizion.prestamo911.entities.HistorialGastoEntity;
import com.biovizion.prestamo911.entities.HistorialSaldoEntity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

public class CurrencyDTOs {
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AllCurrencyDTO{
        private BigDecimal saldo;

        private List<HistorialBalanceEntity> historialBalance;

        // Ingresos
        private List<HistorialDTO> ingresosCapitales;
        private List<HistorialDTO> ingresosVarios;
        private List<AbonoDTO> cuotasAbonos;
        private List<CuotaDTO> cuotasPagadas;

        // Egresos
        private List<HistorialDTO> gastosEmpresa;
        private List<HistorialDTO> egresosVarios;
        private List<HistorialDTO> egresosPagoPlanillas;
        private List<HistorialDTO> egresosCuotasRetiros;
        private List<CreditoDTO> creditosDesembolsados;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CuotasTotalesDTO{
        private BigDecimal totalVencidas;
        private BigDecimal totalPendientes;
        private BigDecimal totalPagadas;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class HistorialDTO {
        private Long id;
        private BigDecimal monto;
        private String motivo;
        private String tipo;
        private LocalDateTime fecha;
        private List<String> imagenes;
    }

    // --- Mapping Methods ---
    public static HistorialDTO mapearAHistorialDTO(HistorialSaldoEntity ingreso) {
        List<String> imagenes = ingreso.getImagenes() != null 
            ? ingreso.getImagenes().stream()
                .map(img -> img.getFilePath())
                .collect(Collectors.toList())
            : List.of();

        return new HistorialDTO(
            ingreso.getId(),
            ingreso.getMonto(),
            ingreso.getMotivo(),
            ingreso.getTipo(),
            ingreso.getFecha(),
            imagenes
        );
    }

    public static HistorialDTO mapearAHistorialDTO(HistorialGastoEntity egreso) {
        List<String> imagenes = egreso.getImagenes() != null 
            ? egreso.getImagenes().stream()
                .map(img -> img.getFilePath())
                .collect(Collectors.toList())
            : List.of();

        return new HistorialDTO(
            egreso.getId(),
            egreso.getMonto(),
            egreso.getMotivo(),
            egreso.getTipo(),
            egreso.getFecha(),
            imagenes
        );
    }

    @SuppressWarnings("unchecked")
    public static List<HistorialDTO> mapearAHistorialDTOs(List<?> entities) {
        if (entities == null || entities.isEmpty()) {
            return List.of();
        }
        
        // Check the type of the first element
        Object first = entities.get(0);
        if (first instanceof HistorialSaldoEntity) {
            return ((List<HistorialSaldoEntity>) entities).stream()
                .map(ingreso -> mapearAHistorialDTO(ingreso))
                .collect(Collectors.toList());
        } else if (first instanceof HistorialGastoEntity) {
            return ((List<HistorialGastoEntity>) entities).stream()
                .map(egreso -> mapearAHistorialDTO(egreso))
                .collect(Collectors.toList());
        }
        
        return List.of();
    }
}
