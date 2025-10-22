package com.biovizion.prestamo911.controller;

import static com.biovizion.prestamo911.DTOs.Credito.CreditoDTOs.mapearACreditoDTOs;
import static com.biovizion.prestamo911.DTOs.Cuota.CuotaDTOs.mapearAAbonoDTOs;
import static com.biovizion.prestamo911.DTOs.Cuota.CuotaDTOs.mapearACuotaDTOs;

import java.math.BigDecimal;
import java.security.Principal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import com.biovizion.prestamo911.DTOs.Currency.CurrencyDTOs.AllCurrencyDTO;
import com.biovizion.prestamo911.DTOs.Currency.CurrencyDTOs.CuotasTotalesDTO;
import com.biovizion.prestamo911.DTOs.Currency.CurrencyRequestDTOs.EgresoRequest;
import com.biovizion.prestamo911.DTOs.Currency.CurrencyRequestDTOs.IngresoRequest;
import com.biovizion.prestamo911.DTOs.GlobalDTOs.ApiResponse;
import com.biovizion.prestamo911.entities.AbonoCuotaEntity;
import com.biovizion.prestamo911.entities.BalanceEntity;
import com.biovizion.prestamo911.entities.CreditoCuotaEntity;
import com.biovizion.prestamo911.entities.CreditoEntity;
import com.biovizion.prestamo911.entities.HistorialBalanceEntity;
import com.biovizion.prestamo911.entities.HistorialGastoEntity;
import com.biovizion.prestamo911.entities.HistorialSaldoEntity;
import com.biovizion.prestamo911.entities.UsuarioEntity;
import com.biovizion.prestamo911.service.AbonoCuotaService;
import com.biovizion.prestamo911.service.BalanceService;
import com.biovizion.prestamo911.service.CreditoCuotaService;
import com.biovizion.prestamo911.service.CreditoService;
import com.biovizion.prestamo911.service.HistorialGastoService;
import com.biovizion.prestamo911.service.HistorialSaldoService;
import com.biovizion.prestamo911.service.PdfService;

import jakarta.servlet.http.HttpServletResponse;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


@Controller
@RequestMapping("/currency")
public class CurrencyController {
    @Autowired
    private BalanceService balanceService;

    @Autowired
    private HistorialSaldoService historialBalanceService;

    @Autowired
    private HistorialSaldoService historialSaldoService;

    @Autowired
    private CreditoCuotaService cuotaService;

    @Autowired
    private AbonoCuotaService abonoService;

    @Autowired
    private HistorialGastoService gastoService;

    @Autowired
    private CreditoService creditoService;

    @Autowired
    private PdfService pdfService;

    @GetMapping("/cuotas")
    public ResponseEntity<ApiResponse> getCuotasTotales() {
        try {
            List<CreditoCuotaEntity> cuotasVencidas = cuotaService.findVencidas();
            List<CreditoCuotaEntity> cuotasPendienetes = cuotaService.findPendientes();
            List<CreditoCuotaEntity> cuotasPagadas = cuotaService.findPagadas();

            BigDecimal totalVencidas = cuotasVencidas.stream()
                                        .map(CreditoCuotaEntity::getTotal)
                                        .reduce(BigDecimal.ZERO, BigDecimal::add);

            BigDecimal totalPendientes = cuotasPendienetes.stream()
                                        .map(CreditoCuotaEntity::getTotal)
                                        .reduce(BigDecimal.ZERO, BigDecimal::add);

            BigDecimal totalPagadas = cuotasPagadas.stream()
                                        .map(CreditoCuotaEntity::getTotal)
                                        .reduce(BigDecimal.ZERO, BigDecimal::add);

            ApiResponse<CuotasTotalesDTO> response = 
                new ApiResponse<>("FETCH Totales de cuotas obtenidos exitosamente", new CuotasTotalesDTO(
                    totalVencidas,
                    totalPendientes, totalPagadas
                ));

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            ApiResponse<String> response = new ApiResponse<>("Error al obtener los totales de cuotas: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @GetMapping("/balance")
    public ResponseEntity<ApiResponse> getBalance() {
        try {
            ApiResponse<AllCurrencyDTO> response = 
                new ApiResponse<>("FETCH Balance obtenido exitosamente", GetCurrentCurrency());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            ApiResponse<String> response = new ApiResponse<>("Error al obtener el balance: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @PostMapping("/ingreso")
    public ResponseEntity<ApiResponse> realizarIngreso(@RequestBody IngresoRequest request) {
        try {
            HistorialSaldoEntity ingreso =new HistorialSaldoEntity();
            ingreso.setMonto(request.getMonto());
            ingreso.setMotivo(request.getMotivo());
            ingreso.setTipo(request.getTipo());
            ingreso.setFecha(request.getFecha().atStartOfDay());
            
            historialSaldoService.save(ingreso);
            AddFondos(request.getMonto());

            ApiResponse<HistorialSaldoEntity> response = 
                new ApiResponse<>("Ingreso realizado exitosamente", ingreso);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            ApiResponse<String> response = new ApiResponse<>("Error al realizar el ingreso: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @PostMapping("/egreso")
    public ResponseEntity<ApiResponse> realizarEgreso(@RequestBody EgresoRequest request) {
        try {
            HistorialGastoEntity egreso = new HistorialGastoEntity();
            egreso.setMonto(request.getMonto());
            egreso.setMotivo(request.getMotivo());
            egreso.setTipo(request.getTipo());
            egreso.setFecha(request.getFecha().atStartOfDay());
            
            gastoService.save(egreso);
            RemoveFondos(request.getMonto());

            ApiResponse<HistorialGastoEntity> response = 
                new ApiResponse<>("Egreso realizado exitosamente", egreso);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            ApiResponse<String> response = new ApiResponse<>("Error al realizar el egreso: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    // --- PDFs ---
    @PostMapping("/ingreso/{fecha}/pdf")
    public void getPDFIngreso(@PathVariable LocalDate fecha, Long usuarioId, HttpServletResponse response) {
        List<CreditoCuotaEntity> cuotas = cuotaService.findAllByEstadoAndFechaPago("Pagado", fecha);
        List<AbonoCuotaEntity> abonos = abonoService.findAllByFecha(fecha);
        List<HistorialSaldoEntity> ingresos = historialSaldoService.findAllByFecha(fecha);
        
        pdfService.generarReporteDiarioIngreso(GetCurrentCurrency().getSaldo(), cuotas, abonos, ingresos, fecha, response);
    }

    @PostMapping("/egreso/{fecha}/pdf")
    public void getPDFEgreso(@PathVariable LocalDate fecha, Long usuarioId, HttpServletResponse response) {
        List<CreditoEntity> creditos = creditoService.findAllByDesembolsadoAndFechaDesembolsado(true, fecha);
        List<HistorialGastoEntity> gastos = gastoService.findAllByFecha(fecha);

        pdfService.generarReporteDiarioEgreso(GetCurrentCurrency().getSaldo(), creditos, gastos, fecha, response);
    }

    public void AddFondos(BigDecimal monto){
        BalanceEntity balance = balanceService.get();
        balance.setSaldo(balance.getSaldo().add(monto));

        balanceService.save(balance);
    }
    public void RemoveFondos(BigDecimal monto){
        BalanceEntity balance = balanceService.get();
        balance.setSaldo(balance.getSaldo().subtract(monto));

        balanceService.save(balance);
    }

    public AllCurrencyDTO GetCurrentCurrency(){
        BalanceEntity balance = balanceService.get();
        
        // Ingresos
        List<HistorialSaldoEntity> ingresosCapitales = historialSaldoService.findAllByTipo("Capital");
        List<HistorialSaldoEntity> ingresosVarios = historialSaldoService.findAllByTipo("Varios");
        List<AbonoCuotaEntity> cuotasAbonos = abonoService.findAll();
        List<CreditoCuotaEntity> cuotasPagadas = cuotaService.findPagadas();

        // Egresos
        List<HistorialGastoEntity> gastosEmpresa = gastoService.findAllByTipo("Empresa");
        List<HistorialGastoEntity> egresosVarios = gastoService.findAllByTipo("Varios");
        List<HistorialGastoEntity> egresosCuotasRetiros = gastoService.findAllByTipo("Retiro de Cuotas");
        List<CreditoEntity> creditosDesembolsados = creditoService.findAllByDesembolsado(true);

        return new AllCurrencyDTO(
            balance.getSaldo(),
            ingresosCapitales,
            ingresosVarios,
            mapearAAbonoDTOs(cuotasAbonos),
            mapearACuotaDTOs(cuotasPagadas),
            gastosEmpresa,
            egresosVarios,
            egresosCuotasRetiros,
            mapearACreditoDTOs(creditosDesembolsados)
        );
    }
}