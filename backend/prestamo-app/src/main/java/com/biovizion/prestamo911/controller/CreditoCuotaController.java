package com.biovizion.prestamo911.controller;

import com.biovizion.prestamo911.entities.BalanceEntity;
import com.biovizion.prestamo911.entities.CreditoCuotaEntity;
import com.biovizion.prestamo911.entities.CreditoEntity;
import com.biovizion.prestamo911.entities.HistorialBalanceEntity;
import com.biovizion.prestamo911.entities.HistorialGastoEntity;
import com.biovizion.prestamo911.entities.HistorialSaldoEntity;
import com.biovizion.prestamo911.entities.UsuarioAccionEntity;
import com.biovizion.prestamo911.entities.UsuarioEntity;
import com.biovizion.prestamo911.repository.CreditoCuotaRepository;
import com.biovizion.prestamo911.service.BalanceService;
import com.biovizion.prestamo911.service.CreditoCuotaService;
import com.biovizion.prestamo911.service.CreditoService;
import com.biovizion.prestamo911.service.HistorialBalanceService;
import com.biovizion.prestamo911.service.HistorialGastoService;
import com.biovizion.prestamo911.service.HistorialSaldoService;
import com.biovizion.prestamo911.service.PdfService;
import com.biovizion.prestamo911.service.UsuarioAccionService;
import com.biovizion.prestamo911.service.UsuarioService;
import com.biovizion.prestamo911.utils.AccionTipo;

import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.security.Principal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.List;
import java.util.Optional;

@Controller
@RequestMapping("/cuota")
public class CreditoCuotaController {

    @Autowired
    private CreditoCuotaService creditoCuotaService;

    @Autowired
    private CreditoCuotaRepository creditoCuotaRepository;

    @Autowired
    private CreditoService creditoService;

    @Autowired
    private HistorialGastoService historialGastoService;

    @Autowired
    private HistorialSaldoService historialSaldoService;

    @Autowired
    private HistorialBalanceService historialBalanceService;

    @Autowired
    private UsuarioService usuarioService;
    
    @Autowired
    private UsuarioAccionService usuarioAccionService;

    @Autowired
    private PdfService pdfService;
    
    @Autowired
    private BalanceService balanceService;
    
    @PutMapping("/{id}")
    public ResponseEntity<?> updateCuota(@PathVariable Long id, 
                                        @RequestParam(required = false) BigDecimal monto,
                                        @RequestParam(required = false) String estado,
                                        @RequestParam(required = false) String fechaVencimiento,
                                        @RequestParam(required = false) String fechaPago,
                                        @RequestParam(required = false) BigDecimal pagoMora,
                                        Principal principal) {
        
        Optional<CreditoCuotaEntity> cuotaOpt = creditoCuotaService.findById(id);
        
        if (cuotaOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        CreditoCuotaEntity cuota = cuotaOpt.get();
        Boolean updated = false;

        if (monto != null) {
            cuota.setMonto(monto);
        }
        if (fechaVencimiento != null) {
            cuota.setFechaVencimiento(LocalDate.parse(fechaVencimiento).atTime(20, 00));
        }
        if (estado != null) {
            cuota.setEstado(estado);
        }
        if (fechaPago != null) {
            cuota.setFechaPago(LocalDate.parse(fechaPago).atTime(20, 00));
        }
        if (pagoMora != null && !updated) {
            cuota.setPagoMora(pagoMora);
        }
        if (monto != null && pagoMora != null){
            cuota.setTotal(monto.add(cuota.getPagoMora()));
        }
        
        creditoCuotaService.save(cuota);
        
        UsuarioEntity usuarioActual = usuarioService.findByDui(principal.getName())
        .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado"));

        UsuarioAccionEntity usuarioAccion = new UsuarioAccionEntity();
        usuarioAccion.setAccion(AccionTipo.EDITADO_CUOTA_ADMIN);
        usuarioAccion.setUsuario(usuarioActual);
        usuarioAccion.setUsuarioAfectado(cuota.getCredito().getUsuario());
        usuarioAccionService.save(usuarioAccion);
        
        return ResponseEntity.ok().build();
    }

    @PostMapping("/pagar/{id}")
    public void pagarCuotaYGenerarPDF(@PathVariable Long id,
                                      @RequestParam("monto") BigDecimal montoPago,
                                      HttpServletResponse response,
                                      Principal principal) {
        try {
            CreditoCuotaEntity cuota = creditoCuotaService.findById(id)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Cuota no encontrada"));
            
            CreditoEntity credito = cuota.getCredito();
            if (credito == null) {
                throw new RuntimeException("Credito is null for cuota: " + id);
            }

            UsuarioEntity usuarioActual = usuarioService.findByDui(principal.getName())
                    .orElseThrow(() -> new RuntimeException("Usuario no encontrado: " + principal.getName()));
                    
            UsuarioAccionEntity usuarioAccion = new UsuarioAccionEntity();

            if (!"ROLE_ADMIN".equals(usuarioActual.getRol()) && !"ROLE_SECRETARIA".equals(usuarioActual.getRol())){                
                // Usuario's Accion

                // Registrar Accion
                // usuarioAccion.setAccion(AccionTipo.MARCADO_PAGADO_CUOTA_ADMIN);
                // usuarioAccion.setUsuario(usuarioActual);
                // usuarioAccionService.save(usuarioAccion);

                cuota.setEstado("EnRevision");
            }
            else
            {
                // Registrar Accion
                usuarioAccion.setAccion(AccionTipo.MARCADO_PAGADO_CUOTA_ADMIN);
                usuarioAccion.setUsuario(usuarioActual);
                usuarioAccion.setUsuarioAfectado(cuota.getCredito().getUsuario());
                usuarioAccionService.save(usuarioAccion);

                cuota.setEstado("Pagado");

                BalanceEntity balance = balanceService.get();
                balance.setSaldo(balance.getSaldo().add(cuota.getTotal()));
            }

            cuota.setFechaPago(LocalDate.now().atTime(20, 00));
            creditoCuotaService.save(cuota);            

            long pagadas = creditoCuotaService.findPagadasByCreditoId(credito.getId()).size();

            if (pagadas >= credito.getCuotaCantidad()) {
                credito.setEstado("Finalizado");
            }

            creditoService.save(credito);

            // Generar y devolver PDF                    
            response.setContentType("application/pdf");
            pdfService.generarFacturaPDF(cuota, response);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error procesando pago", e);
        }
    }

    @PostMapping("/marcar-pendiente/{id}")
    public ResponseEntity<String> marcarPendiente(@PathVariable Long id, HttpServletResponse response){
        try {
            CreditoCuotaEntity cuota = creditoCuotaService.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Cuota no encontrada"));

            cuota.setEstado("Pendiente");

            return ResponseEntity.ok("Estado actualizado a Pendiente");
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error procesando pago", e);
        }
    }

    @PostMapping("/aceptar/{id}")
    public ResponseEntity<String> aceptarCuota(@PathVariable Long id) {
        try {
            // Find the cuota
            CreditoCuotaEntity cuota = creditoCuotaService.findById(id)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Cuota not found"));

            CreditoEntity credito = cuota.getCredito();

            // Change status from EnRevision to Pagado
            cuota.setEstado("Pagado");
            
            BalanceEntity balance = balanceService.get();
            balance.setSaldo(balance.getSaldo().add(cuota.getTotal()));
            
            cuota.setFechaPago(LocalDate.now().atTime(20, 00));
            creditoCuotaService.save(cuota);

            long pagadas = creditoCuotaService.findPagadasByCreditoId(credito.getId()).size();

            if (pagadas >= credito.getCuotaCantidad()) {
                credito.setEstado("Finalizado");
            }

            creditoService.save(credito);

            return ResponseEntity.ok("Cuota aceptada exitosamente");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error al aceptar la cuota: " + e.getMessage());
        }
    }

    // Manual trigger for testing expired cuotas (optional)
    @GetMapping("/probar")
    public String checkExpiredCuotas() {
        try {

            LocalDate elSalvadorDate = LocalDate.now(ZoneId.of("America/El_Salvador"));
            
            System.out.println("Starting scheduled task at " + java.time.LocalDateTime.now());
            // --- Balances ---
            List<CreditoCuotaEntity> cuotasPagadas = creditoCuotaService.findAllByEstadoAndFechaPago("Pagado", elSalvadorDate);
            BigDecimal totalCuotasPagadas = cuotasPagadas.stream()
                .map(CreditoCuotaEntity::getTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
            System.out.println(cuotasPagadas);
            System.out.println(totalCuotasPagadas);

            List<HistorialSaldoEntity> historialSaldo = historialSaldoService.findAllByFecha(elSalvadorDate);
            BigDecimal totalHistorialSaldo = historialSaldo.stream()
                .map(HistorialSaldoEntity::getMonto)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
            System.out.println(historialSaldo);
            System.out.println(totalHistorialSaldo);

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
            historialBalance.setFecha(LocalDateTime.now());
            historialBalance.setMonto(balanceActual.getSaldo());
            historialBalance.setIngresosTotales(ingresosTotales);
            historialBalance.setEgresosTotales(egresosTotales);
            historialBalanceService.save(historialBalance);
           
            creditoCuotaService.updateCuotasMora();
            creditoCuotaService.updateExpiredCuotas();
            creditoService.updateCreditRatings();
            return "redirect:/admin/creditos/cobros?message=Expired cuotas checked successfully";
        } catch (Exception e) {
            return "redirect:/admin/creditos/cobros?error=Error checking expired cuotas: " + e.getMessage();
        }
    }
}