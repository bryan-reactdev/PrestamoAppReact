package com.biovizion.prestamo911;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.biovizion.prestamo911.entities.BalanceEntity;
import com.biovizion.prestamo911.entities.CreditoCuotaEntity;
import com.biovizion.prestamo911.entities.CreditoEntity;
import com.biovizion.prestamo911.entities.HistorialBalanceEntity;
import com.biovizion.prestamo911.entities.HistorialGastoEntity;
import com.biovizion.prestamo911.entities.HistorialSaldoEntity;
import com.biovizion.prestamo911.service.BalanceService;
import com.biovizion.prestamo911.service.CreditoCuotaService;
import com.biovizion.prestamo911.service.CreditoService;
import com.biovizion.prestamo911.service.HistorialBalanceService;
import com.biovizion.prestamo911.service.HistorialGastoService;
import com.biovizion.prestamo911.service.HistorialSaldoService;

@Component
public class ScheduledTasks {
    
    @Autowired
    private CreditoCuotaService creditoCuotaService;
    
    @Autowired
    private CreditoService creditoService;
    
    @Autowired
    private HistorialBalanceService historialBalanceService;
    
    @Autowired
    private HistorialSaldoService historialSaldoService;

    @Autowired
    private HistorialGastoService historialGastoService;
    
    @Autowired
    private BalanceService balanceService;
    
    @Scheduled(cron = "0 0 6 * * ?", zone = "UTC")
    public void checkExpiredCuotas() {
        try {
            LocalDate elSalvadorDate = LocalDate.now(ZoneId.of("America/El_Salvador"));
            
            System.out.println("Starting scheduled task at " + java.time.LocalDateTime.now());
            // --- Balances ---
            List<CreditoCuotaEntity> cuotasPagadas = creditoCuotaService.findAllByEstadoAndFechaPago("Pagado", elSalvadorDate);
            BigDecimal totalCuotasPagadas = cuotasPagadas.stream()
                .map(CreditoCuotaEntity::getTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

            List<HistorialSaldoEntity> historialSaldo = historialSaldoService.findAllByFecha(elSalvadorDate);
            BigDecimal totalHistorialSaldo = historialSaldo.stream()
                .map(HistorialSaldoEntity::getMonto)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

            List<CreditoEntity> creditosDesembolsados = creditoService.findAllByDesembolsadoAndFechaDesembolsado(true, elSalvadorDate);
            BigDecimal totalCreditosDesembolsados = creditosDesembolsados.stream()
                .map(c -> {
                    BigDecimal montoDado = c.getMontoDado();
                    if (montoDado != null && montoDado.compareTo(BigDecimal.ZERO) != 0) {
                        return montoDado;
                    } else {
                        return c.getMonto();
                    }
                })
                .reduce(BigDecimal.ZERO, BigDecimal::add);

            List<HistorialGastoEntity> historialGastos = historialGastoService.findAllByFecha(elSalvadorDate);
            BigDecimal totalHistorialGastos = historialGastos.stream()
                .map(HistorialGastoEntity::getMonto)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

            BigDecimal ingresosTotales = totalCuotasPagadas.add(totalHistorialSaldo);
            BigDecimal egresosTotales = totalCreditosDesembolsados.add(totalHistorialGastos);
            BalanceEntity balanceActual = balanceService.get();

            HistorialBalanceEntity historialBalance = new HistorialBalanceEntity();
            // Set fecha to midnight SV time for the day being summarized (yesterday)
            // At midnight Oct 29, we're summarizing Oct 28, so save as Oct 28 00:00:00
            historialBalance.setFecha(elSalvadorDate.atStartOfDay());
            historialBalance.setMonto(balanceActual.getSaldo());
            historialBalance.setIngresosTotales(ingresosTotales);
            historialBalance.setEgresosTotales(egresosTotales);
            historialBalanceService.save(historialBalance);

            // --- Creditos y Cuotas ---
            creditoCuotaService.updateCuotasMora();
            creditoCuotaService.updateExpiredCuotas();
            
            // Update credit ratings based on expired cuotas
            creditoService.updateCreditRatings();
            
            System.out.println("Scheduled task completed successfully");
        } catch (Exception e) {
            System.err.println("Error in scheduled task: " + e.getMessage());
            e.printStackTrace();
        }
    }
} 