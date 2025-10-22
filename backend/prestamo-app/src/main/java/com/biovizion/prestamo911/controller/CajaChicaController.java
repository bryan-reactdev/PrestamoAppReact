package com.biovizion.prestamo911.controller;


import com.biovizion.prestamo911.entities.*;
import com.biovizion.prestamo911.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;

@Controller
@RequestMapping("/CajaChica")
public class CajaChicaController {

    @Autowired
    private CreditoService creditoService;

    @Autowired
    private CreditoCuotaService creditoCuotaService;

    @Autowired
    private AbonoCuotaService abonoCuotaService;

    @Autowired
    private HistorialBalanceService historialBalanceService;

    @Autowired
    private HistorialSaldoService historialSaldoService;

    @Autowired
    private HistorialGastoService historialGastoService;

    @Autowired
    private BalanceService balanceService;

    @GetMapping("")
    public String CajaChica(Model model ) {     
        List<CreditoCuotaEntity> cuotasPagadas = creditoCuotaService.findPagadas();
        List<AbonoCuotaEntity> abonosCuotas = abonoCuotaService.findAll();   
        List<CreditoEntity> creditosDesembolsados = creditoService.findAllByDesembolsado(true);
        List<HistorialBalanceEntity> historialBalances = historialBalanceService.findAll();
        List<HistorialSaldoEntity> historialIngresos = historialSaldoService.findAll();
        List<HistorialGastoEntity> historialGastos = historialGastoService.findAll();

        BalanceEntity balance = balanceService.get();

        model.addAttribute("historialIngresosCaja", historialIngresos);
        model.addAttribute("historialGastos", historialGastos);
        model.addAttribute("cuotasPagadas", cuotasPagadas);
        model.addAttribute("abonosCuotas", abonosCuotas);
        model.addAttribute("creditosDesembolsados", creditosDesembolsados);
        model.addAttribute("historialBalances", historialBalances);
        model.addAttribute("saldo", balance.getSaldo());

        return "cajaChica/cajaChica";
    }

    @GetMapping("/historial-caja-chica")
    public String historialCajaChica(Model model) {
        LocalDate elSalvadorDate = LocalDate.now(ZoneId.of("America/El_Salvador"));

        List<HistorialBalanceEntity> historialBalances = historialBalanceService.findAll();
        BalanceEntity balance = balanceService.get();

        List<CreditoCuotaEntity> cuotasPagadas = creditoCuotaService.findAllByEstadoAndFechaPago("Pagado", elSalvadorDate);
        List<CreditoEntity> creditosDesembolsados = creditoService.findAllByDesembolsadoAndFechaDesembolsado(true, elSalvadorDate);
        List<HistorialGastoEntity> historialGastos = historialGastoService.findAllByFecha(elSalvadorDate);
        List<HistorialSaldoEntity> historialSaldo = historialSaldoService.findAllByFecha(elSalvadorDate);

        // --- Balances ---
        BigDecimal totalCuotasPagadas = cuotasPagadas.stream()
            .map(CreditoCuotaEntity::getTotal)
            .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalHistorialSaldo = historialSaldo.stream()
            .map(HistorialSaldoEntity::getMonto)
            .reduce(BigDecimal.ZERO, BigDecimal::add);

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

        BigDecimal totalHistorialGastos = historialGastos.stream()
            .map(HistorialGastoEntity::getMonto)
            .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal ingresosTotales = totalCuotasPagadas.add(totalHistorialSaldo);
        BigDecimal egresosTotales = totalCreditosDesembolsados.add(totalHistorialGastos);
        
        List<CreditoEntity> creditosDesembolsadosAll = creditoService.findAllByDesembolsado(true);
        List<CreditoCuotaEntity> cuotasPagadasAll = creditoCuotaService.findPagadas();
        List<HistorialGastoEntity> historialGastosAll = historialGastoService.findAll();
        List<HistorialSaldoEntity> historialIngresosAll = historialSaldoService.findAll();

        model.addAttribute("ingresosTotales", ingresosTotales);
        model.addAttribute("egresosTotales", egresosTotales);
        model.addAttribute("historialBalance", historialBalances);
        model.addAttribute("creditosDesembolsados", creditosDesembolsadosAll);
        model.addAttribute("cuotasPagadas", cuotasPagadasAll);
        model.addAttribute("cajaGastos", historialGastosAll);
        model.addAttribute("cajaIngresos", historialIngresosAll);
        model.addAttribute("balance", balance);

        return "cajaChica/historialCajaChica";
    }

    @GetMapping("/registro-ingresos")
    public String registroIngresos(Model model) 
    {
        List<HistorialSaldoEntity> ingresos = historialSaldoService.findAll();
        List<CreditoCuotaEntity> cuotasPagadas = creditoCuotaService.findPagadas();
        List<AbonoCuotaEntity> abonosCuotas = abonoCuotaService.findAll();

        model.addAttribute("cuotasPagadas", cuotasPagadas);
        model.addAttribute("abonosCuotas", abonosCuotas);
        model.addAttribute("ingresosCaja", ingresos);

        return "cajaChica/historialIngresos";
    }
    @GetMapping("/registro-egresos")
    public String registroEgresos(Model model) {
        List<HistorialGastoEntity> historialGastos = historialGastoService.findAll();
        List<CreditoEntity> creditosDesembolsados = creditoService.findAllByDesembolsado(true);

        model.addAttribute("creditosDesembolsados", creditosDesembolsados);
        model.addAttribute("cajaGastos", historialGastos);

        return "cajaChica/historialEgresos";
    }
}
