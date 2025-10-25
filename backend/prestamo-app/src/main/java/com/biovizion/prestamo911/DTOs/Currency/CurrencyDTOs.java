package com.biovizion.prestamo911.DTOs.Currency;

import java.math.BigDecimal;
import java.util.List;

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
        private List<HistorialSaldoEntity> ingresosCapitales;
        private List<HistorialSaldoEntity> ingresosVarios;
        private List<AbonoDTO> cuotasAbonos;
        private List<CuotaDTO> cuotasPagadas;

        // Egresos
        private List<HistorialGastoEntity> gastosEmpresa;
        private List<HistorialGastoEntity> egresosVarios;
        private List<HistorialGastoEntity> egresosCuotasRetiros;
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
}
