package com.biovizion.prestamo911.controller;

import static com.biovizion.prestamo911.DTOs.Credito.CreditoDTOs.mapearACreditoDTOs;
import static com.biovizion.prestamo911.DTOs.Credito.CreditoDTOs.mapearACreditoTablaDTOs;
import static com.biovizion.prestamo911.DTOs.Cuota.CuotaDTOs.mapearACuotaTablaDTOs;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.server.ResponseStatusException;

import com.biovizion.prestamo911.DTOs.Credito.CreditoRequestDTOs;
import com.biovizion.prestamo911.DTOs.Credito.CreditoDTOs.CreditoDTO;
import com.biovizion.prestamo911.DTOs.Credito.CreditoDTOs.CreditoTablaDTO;
import com.biovizion.prestamo911.DTOs.Credito.CreditoRequestDTOs.CreditoAceptarRequest;
import com.biovizion.prestamo911.DTOs.Credito.CreditoRequestDTOs.CreditoDescargableRequest;
import com.biovizion.prestamo911.DTOs.Credito.CreditoRequestDTOs.CreditoDesembolsableRequest;
import com.biovizion.prestamo911.DTOs.Credito.CreditoRequestDTOs.CreditoDesembolsarRequest;
import com.biovizion.prestamo911.DTOs.Credito.CreditoRequestDTOs.CreditoFullDTO;
import com.biovizion.prestamo911.DTOs.Credito.CreditoRequestDTOs.CreditoEditableRequest;
import com.biovizion.prestamo911.DTOs.Credito.CreditoRequestDTOs.CreditoSolicitudRequest;
import com.biovizion.prestamo911.DTOs.Cuota.CuotaDTOs.CuotaDTO;
import com.biovizion.prestamo911.DTOs.Cuota.CuotaDTOs.CuotaTablaDTO;
import com.biovizion.prestamo911.DTOs.GlobalDTOs.ApiResponse;
import com.biovizion.prestamo911.DTOs.GlobalDTOs.GroupDTO;
import com.biovizion.prestamo911.entities.CreditoCuotaEntity;
import com.biovizion.prestamo911.entities.CreditoEntity;
import com.biovizion.prestamo911.entities.UsuarioEntity;
import com.biovizion.prestamo911.entities.UsuarioSolicitudEntity;
import com.biovizion.prestamo911.service.CreditoCuotaService;
import com.biovizion.prestamo911.service.CreditoService;
import com.biovizion.prestamo911.service.PdfService;
import com.biovizion.prestamo911.service.UsuarioService;
import com.biovizion.prestamo911.utils.CreditoUtils;
import com.biovizion.prestamo911.utils.CuotaUtils;
import com.biovizion.prestamo911.utils.CurrencyUtils;
import com.biovizion.prestamo911.utils.AccionLogger;
import com.biovizion.prestamo911.utils.AccionTipo;

import jakarta.servlet.http.HttpServletResponse;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;


@SuppressWarnings("rawtypes")
@Controller
@RequestMapping("/creditoTest")
public class CreditoControllerTest {
    @Autowired
    private CurrencyUtils currencyUtils;

    @Autowired
    private CuotaUtils cuotaUtils;

    @Autowired
    private CreditoService creditoService;

    @Autowired
    private CreditoCuotaService cuotaService;

    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private PdfService pdfService;

    @Autowired
    private CreditoUtils creditoUtils;

    @Autowired
    private AccionLogger accionLogger;

    // --- Get ---
    @GetMapping("/")
    public ResponseEntity<ApiResponse> getCreditos() {
        try {
            // --- Admin Fetch ---
            List<CreditoEntity> creditos = creditoService.findAll();
            List<CreditoEntity> creditosPendientes = creditoService.findPendientes();
            List<CreditoEntity> creditosAceptados = creditoService.findAceptados();
            List<CreditoEntity> creditosRechazados = creditoService.findRechazados();
            List<CreditoEntity> creditosFinalizados = creditoService.findFinalizados();

            List<CreditoTablaDTO> todosDTOs = mapearACreditoTablaDTOs(creditos);
            List<CreditoTablaDTO> pendientesDTOs = mapearACreditoTablaDTOs(creditosPendientes);
            List<CreditoTablaDTO> aceptadosDTOs = mapearACreditoTablaDTOs(creditosAceptados);
            List<CreditoTablaDTO> rechazadosDTOs = mapearACreditoTablaDTOs(creditosRechazados);
            List<CreditoTablaDTO> finalizadosDTOs = mapearACreditoTablaDTOs(creditosFinalizados);

            List<GroupDTO<CreditoTablaDTO>> groupedResponse = Arrays.asList(
                new GroupDTO<>("Todos", todosDTOs),
                new GroupDTO<>("Pendientes", pendientesDTOs),
                new GroupDTO<>("Aceptados", aceptadosDTOs),
                new GroupDTO<>("Rechazados", rechazadosDTOs),
                new GroupDTO<>("Finalizados", finalizadosDTOs)
            );

            ApiResponse<List<GroupDTO<CreditoTablaDTO>>> response = new ApiResponse<>("FETCH Créditos obtenidos exitosamente", groupedResponse);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            ApiResponse<String> response = new ApiResponse<>("Error al obtener los créditos: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse> getCredito(@PathVariable Long id) {
        try {
            CreditoEntity credito = creditoService.findById(id)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Credito no encontrado"));

            CreditoFullDTO creditoDTO = CreditoRequestDTOs.mapearACreditoEditDTO(credito);
            
            ApiResponse<CreditoFullDTO> response = new ApiResponse<>("FETCH Crédito obtenido exitosamente", creditoDTO);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            ApiResponse<String> response = new ApiResponse<>("Error al obtener el crédito: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }
    
    @GetMapping("/{id}/refinanciables")
    public ResponseEntity<ApiResponse> getCreditosRefinanciables(@PathVariable Long id) {
        try {
            CreditoEntity credito = creditoService.findById(id)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Credito no encontrado"));

            List<CreditoEntity> creditos = creditoService.findAceptadosByUsuarioId(credito.getUsuario().getId());
            List<CreditoEntity> creditosRefinanciables = creditos.stream()
                                                        .filter(c -> c.getDesembolsado() == true)
                                                        .collect(Collectors.toList());

            List<CreditoDTO> creditoDTOs = mapearACreditoDTOs(creditosRefinanciables);

            ApiResponse<List<CreditoDTO>> response = new ApiResponse<>("FETCH Créditos refinanciables obtenido exitosamente", creditoDTOs);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            ApiResponse<String> response = new ApiResponse<>("Error al obtener los créditos refinanciables: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }
    
    @GetMapping("/{id}/cuotas")
    public ResponseEntity<ApiResponse> getCuotasDeCredito(@PathVariable Long id){
        try {
            List<CreditoCuotaEntity> cuotas = cuotaService.findByCreditoId(id);
            List<CreditoCuotaEntity> cuotasPendientes = cuotaService.findPendientesByCreditoId(id);
            List<CreditoCuotaEntity> cuotasPagadas = cuotaService.findPagadasByCreditoId(id);
            List<CreditoCuotaEntity> cuotasVencidas = cuotaService.findVencidasByCreditoId(id);
            List<CreditoCuotaEntity> cuotasEnRevision = cuotaService.findEnRevisionByCreditoId(id);

            List<CuotaTablaDTO> todosDTOs = mapearACuotaTablaDTOs(cuotas);
            List<CuotaTablaDTO> pendientesDTOs = mapearACuotaTablaDTOs(cuotasPendientes);
            List<CuotaTablaDTO> pagadasDTOs = mapearACuotaTablaDTOs(cuotasPagadas);
            List<CuotaTablaDTO> vencidasDTOs = mapearACuotaTablaDTOs(cuotasVencidas);
            List<CuotaTablaDTO> enRevisionDTOs = mapearACuotaTablaDTOs(cuotasEnRevision);
            
            List<GroupDTO<CuotaTablaDTO>> groupedResponse = Arrays.asList(
                new GroupDTO<>("Todos", todosDTOs),
                new GroupDTO<>("Pendientes", pendientesDTOs),
                new GroupDTO<>("Pagadas", pagadasDTOs),
                new GroupDTO<>("Vencidas", vencidasDTOs),
                new GroupDTO<>("EnRevision", enRevisionDTOs)
            );
           
            ApiResponse<List<GroupDTO<CuotaTablaDTO>>> response = new ApiResponse<>("FETCH Cuotas del crédito obtenidas exitosamente", groupedResponse);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();

            ApiResponse<String> response = new ApiResponse<>("Error al obtener las cuotas del crédito: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @GetMapping("/usuario/{usuarioId}/existing-solicitud")
    public ResponseEntity<ApiResponse> getExistingSolicitud(@PathVariable Long usuarioId) {
        try {
            Optional<CreditoEntity> existingCredito = creditoService.findMostRecentByUsuarioId(usuarioId);
            
            if (existingCredito.isPresent()) {
                CreditoFullDTO creditoDTO = CreditoRequestDTOs.mapearACreditoEditDTO(existingCredito.get());
                ApiResponse<CreditoFullDTO> response = new ApiResponse<>("Solicitud existente encontrada", creditoDTO);
                return ResponseEntity.ok(response);
            } else {
                ApiResponse<String> response = new ApiResponse<>("No se encontró solicitud existente");
                return ResponseEntity.ok(response);
            }
        } catch (Exception e) {
            ApiResponse<String> response = new ApiResponse<>("Error al obtener solicitud existente: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    // --- POST ---
    @PostMapping(value = "/crear", consumes = "multipart/form-data" )
    public ResponseEntity<ApiResponse> crearCredito(@ModelAttribute CreditoSolicitudRequest request) {
        try {
            Optional<UsuarioEntity> usuarioOpt = usuarioService.findById(request.getUsuarioId());
            if (!usuarioOpt.isPresent()) {
                ApiResponse<String> response = new ApiResponse<>("Usuario no encontrado");
                return ResponseEntity.status(404).body(response);
            }

            UsuarioEntity usuario = usuarioOpt.get();

            creditoUtils.CreateRequestCredito(request, usuario);

            // Log action
            accionLogger.logAccion(AccionTipo.CREADO_CREDITO_ADMIN, usuario);

            ApiResponse<String> response = new ApiResponse<>("Crédito creado exitosamente");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            ApiResponse<String> response = new ApiResponse<>("Error al crear crédito para el usuario");
            return ResponseEntity.status(500).body(response);
        }
    }

    // --- ACCIONES ---

    // -- Editar --
    @PutMapping(value = "/{id}", consumes = "multipart/form-data")
    public ResponseEntity<ApiResponse> editCredito(@PathVariable Long id, @ModelAttribute CreditoFullDTO request) {
        try {
            CreditoEntity credito = creditoService.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Credito no encontrado"));
            UsuarioEntity usuarioAfectado = credito.getUsuario();
            
            creditoUtils.UpdateCredito(id, request);
            
            // Log action
            accionLogger.logAccion(AccionTipo.EDITADO_CREDITO_ADMIN, usuarioAfectado);
            
            ApiResponse<String> response = new ApiResponse<>("Credito editado exitosamente");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            ApiResponse<String> response = new ApiResponse<>("Error al editar el crédito");
            return ResponseEntity.status(500).body(response);
        }
    }

    // -- Aceptar --
    @PostMapping("/aceptar/{id}")
    public ResponseEntity<ApiResponse> aceptarCredito(@PathVariable Long id, @RequestBody CreditoAceptarRequest request){
        try {
            if (request == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(new ApiResponse<>("Error: request body is required"));
            }

            CreditoEntity credito = creditoService.findById(id)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Credito no encontrado"));

            // Null-safe helpers
            final Function<BigDecimal, BigDecimal> safe = (b) -> b == null ? BigDecimal.ZERO : b;

            // Validate montoAprobado before using compareTo
            BigDecimal montoAprobado = safe.apply(request.getMontoAprobado());
            // If you want to require montoAprobado to be non-zero, validate explicitly:
            // if (request.getMontoAprobado() == null) throw new IllegalArgumentException("Monto aprobado requerido");

            if (montoAprobado.compareTo(new BigDecimal("200")) < 0) {
                credito.setTipo("rapi-cash");
            } else {
                credito.setTipo("prendario");
            }

            credito.setMonto(montoAprobado);
            credito.setPlazoFrecuencia(request.getFrecuencia());
            credito.setCuotaCantidad(request.getCuotaCantidad());
            credito.setCuotaMensual(safe.apply(request.getCuotaMensual()));
            credito.setMora(safe.apply(request.getMora()));
            credito.setEstado("Aceptado");
            credito.setFechaAceptado(LocalDateTime.now());

            if (request.getSelectedCreditoId() != null) {
                Optional<CreditoEntity> optionalCredito = creditoService.findById(request.getSelectedCreditoId());
                if (!optionalCredito.isEmpty()) {
                    CreditoEntity selectedCredito = optionalCredito.get();
                    List<CuotaDTO> cuotasActualizadas = request.getSelectedCuotas();
                    BigDecimal aDescontar = BigDecimal.ZERO;

                    if (cuotasActualizadas != null) {
                        for (CreditoCuotaEntity cuotaEntity : selectedCredito.getCuotas()) {
                            // Find matching cuota by ID
                            CuotaDTO cuotaDTO = cuotasActualizadas.stream()
                                    .filter(c -> Objects.equals(c.getId(), cuotaEntity.getId()))
                                    .findFirst()
                                    .orElse(null);

                            if (cuotaDTO != null) {
                                // Null-safe extraction
                                BigDecimal monto = safe.apply(cuotaDTO.getMonto());
                                BigDecimal mora = safe.apply(cuotaDTO.getMora());
                                BigDecimal abono = safe.apply(cuotaDTO.getAbono());

                                // total = monto + mora - abono (all null-safe)
                                BigDecimal total = monto.add(mora).subtract(abono);

                                cuotaEntity.setMonto(monto);
                                cuotaEntity.setPagoMora(mora);
                                cuotaEntity.setAbono(abono);
                                cuotaEntity.setTotal(total);

                                aDescontar = aDescontar.add(total);
                            }
                        }
                    }

                    selectedCredito.setRefinanciado(true);
                    selectedCredito.setEstado("Finalizado");

                    List<CreditoCuotaEntity> cuotas = selectedCredito.getCuotas().stream()
                            .filter(c -> !"Pagado".equals(c.getEstado()))
                            .peek(c -> {
                                cuotaUtils.pagarCuota(c);
                            })
                            .collect(Collectors.toList());

                    // Null-safe montoDado calculation
                    BigDecimal montoActual = safe.apply(credito.getMonto());
                    BigDecimal descuento = safe.apply(aDescontar);
                    credito.setMontoDado(montoActual.subtract(descuento));

                    creditoService.save(selectedCredito);
                    cuotaService.saveAll(cuotas);
                }
            } else {
                // No selectedCreditoId — ensure montoDado still set (safe)
                BigDecimal montoActual = safe.apply(credito.getMonto());
                credito.setMontoDado(montoActual);
            }

            creditoService.save(credito);

            // Log action
            accionLogger.logAccion(AccionTipo.ACEPTADO_CREDITO_ADMIN, credito.getUsuario());

            ApiResponse<String> response = new ApiResponse<>("Crédito aceptado exitosamente!");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            ApiResponse<String> response = new ApiResponse<>("Error al aceptar crédito: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    // -- Rechazar --
    @PostMapping("/rechazar/{id}")
    public ResponseEntity<ApiResponse> rechazarCredito(@PathVariable Long id){
        try {
            CreditoEntity credito = creditoService.findById(id)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Credito no encontrado"));            

            credito.setEstado("Rechazado");
            credito.setFechaRechazado(LocalDateTime.now());
            creditoService.save(credito);

            // Log action
            accionLogger.logAccion(AccionTipo.RECHAZADO_CREDITO_ADMIN, credito.getUsuario());

            ApiResponse<String> response = new ApiResponse<>("Crédito rechazado exitosamente!");           
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            ApiResponse<String> response = new ApiResponse<>("Error al rechazar crédito: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    // -- Desembolsar --
    @PostMapping("/desembolsar/{id}")
    public ResponseEntity<ApiResponse> desembolsarCredito(@PathVariable Long id, @RequestBody CreditoDesembolsarRequest request) {
        try {
            Optional<CreditoEntity> optionalCredito = creditoService.findById(id);
            if (!optionalCredito.isPresent()) {
                ApiResponse<String> response = new ApiResponse<>("Crédito no encontrado");
                return ResponseEntity.status(404).body(response);
            }

            CreditoEntity credito = optionalCredito.get();
            credito.setDesembolsado(request.isDesembolsar());
            credito.setFechaDesembolsado(request.getFechaDesembolso().atStartOfDay());

            if (request.isDesembolsar()){
                currencyUtils.removeFondos((credito.getMontoDado() != null && credito.getMontoDado() != BigDecimal.ZERO) ? credito.getMontoDado() : credito.getMonto());
                generarCuotas(credito.getCuotaCantidad(), request.getFechaPrimeraComision(), credito);
            }
            else{
                currencyUtils.addFondos((credito.getMontoDado() != null && credito.getMontoDado() != BigDecimal.ZERO) ? credito.getMontoDado() : credito.getMonto());
                credito.setFechaDesembolsado(null);
                List<CreditoCuotaEntity> cuotasExistentes = cuotaService.findByCreditoId(credito.getId());

                for (CreditoCuotaEntity cuota : cuotasExistentes) {
                    cuotaService.delete(cuota.getId());
                }
            }

            creditoService.save(credito);

            // Log action
            if (request.isDesembolsar()) {
                accionLogger.logAccion(AccionTipo.DESEMBOLSADO_CREDITO_ADMIN, credito.getUsuario());
            } else {
                accionLogger.logAccion(AccionTipo.REVERTIR_DESEMBOLSADO_CREDITO_ADMIN, credito.getUsuario());
            }

            ApiResponse<String> response = new ApiResponse<>(
                request.isDesembolsar()
                ? "Crédito marcado como desembolsado exitosamente"
                : "Crédito marcado como pendiente de desembolso exitosamente"
            );

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            ApiResponse<String> response = new ApiResponse<>("Error al desembolsar crédito: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    // -- Editable --
    @PostMapping("/editable/{id}")
    public ResponseEntity<ApiResponse> editableCredito(@PathVariable Long id, @RequestBody CreditoEditableRequest request) {
        try {
            Optional<CreditoEntity> optionalCredito = creditoService.findById(id);
            if (!optionalCredito.isPresent()) {
                ApiResponse<String> response = new ApiResponse<>("Crédito no encontrado");
                return ResponseEntity.status(404).body(response);
            }
            CreditoEntity credito = optionalCredito.get();
            credito.setEditable(request.isEditable());
            creditoService.save(credito);

            // Log action
            accionLogger.logAccion(AccionTipo.EDITABLE_CREDITO_ADMIN, credito.getUsuario());

            ApiResponse<String> response = new ApiResponse<>(
                request.isEditable()
                ? "Crédito marcado como editable exitosamente"
                : "Crédito marcado como no editable exitosamente"
            );

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            ApiResponse<String> response = new ApiResponse<>("Error al marcar crédito como editable: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    // -- Descargable --
    @PostMapping("/descargable/{id}")
    public ResponseEntity<ApiResponse> descargableCredito(@PathVariable Long id, @RequestBody CreditoDescargableRequest request) {
        try {
            Optional<CreditoEntity> optionalCredito = creditoService.findById(id);
            if (!optionalCredito.isPresent()) {
                ApiResponse<String> response = new ApiResponse<>("Crédito no encontrado");
                return ResponseEntity.status(404).body(response);
            }
            CreditoEntity credito = optionalCredito.get();
            credito.setDescargable(request.isDescargable());
            creditoService.save(credito);

            // Log action
            accionLogger.logAccion(AccionTipo.DESCARGABLE_CREDITO_ADMIN, credito.getUsuario());

            ApiResponse<String> response = new ApiResponse<>(
                request.isDescargable()
                ? "Crédito marcado como descargable exitosamente"
                : "Crédito marcado como no descargable exitosamente"
            );

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            ApiResponse<String> response = new ApiResponse<>("Error al marcar crédito como descargable: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    // -- Desembolsable --
    @PostMapping("/desembolsable/{id}")
    public ResponseEntity<ApiResponse> desembolsableCredito(@PathVariable Long id, @RequestBody CreditoDesembolsableRequest request) {
        try {
            Optional<CreditoEntity> optionalCredito = creditoService.findById(id);
            if (!optionalCredito.isPresent()) {
                ApiResponse<String> response = new ApiResponse<>("Crédito no encontrado");
                return ResponseEntity.status(404).body(response);
            }
            CreditoEntity credito = optionalCredito.get();
            credito.setDesembolsable(request.isDesembolsable());
            creditoService.save(credito);

            // Log action
            accionLogger.logAccion(AccionTipo.DESEMBOLSABLE_CREDITO_ADMIN, credito.getUsuario());

            ApiResponse<String> response = new ApiResponse<>(
                request.isDesembolsable()
                ? "Crédito marcado como desembolsable exitosamente"
                : "Crédito marcado como no desembolsable exitosamente"
            );

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            ApiResponse<String> response = new ApiResponse<>("Error al marcar crédito como descargable: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    // PDFs
    @PostMapping("/pdf/{creditoId}/{tipo}")
    public void generarPDFTipo(@PathVariable Long creditoId, @PathVariable String tipo, HttpServletResponse response){
        CreditoEntity credito = creditoService.findById(creditoId)
            .orElseThrow(() -> new RuntimeException("No existe el credito con id " + creditoId));
        UsuarioSolicitudEntity usuarioSolicitud = credito.getUsuarioSolicitud();
        UsuarioEntity usuario = credito.getUsuario();

        credito.setDescargable(false);
        creditoService.save(credito);

        // Log action
        accionLogger.logAccion(AccionTipo.DESCARGADO_PDF_ADMIN, usuario);

        pdfService.generarUsuarioSolicitudPDF(usuarioSolicitud, usuario, credito,  tipo, response);
    }

    // --- Helpers ---
    List<CreditoCuotaEntity> generarCuotas(Integer cantidadCuotas, LocalDate primerFecha, CreditoEntity credito){
        List<CreditoCuotaEntity> nuevasCuotas = new ArrayList<>();

        for (int i = 0; i < (cantidadCuotas) ; i++) {
            CreditoCuotaEntity cuota = new CreditoCuotaEntity();
            cuota.setCredito(credito);
            
            // Calcular dependiendo de la frecuencia
            switch (credito.getPlazoFrecuencia()) {
                case "Mensual":
                    cuota.setFechaVencimiento(primerFecha.plusMonths(i).atTime(20, 00));
                    break;
                case "Quincenal":
                    cuota.setFechaVencimiento(primerFecha.plusDays(15 * i).atTime(20, 00));
                    break;
                case "Semanal":
                    cuota.setFechaVencimiento(primerFecha.plusWeeks(i).atTime(20, 00));
                    break;
                case "Diaria":
                    cuota.setFechaVencimiento(primerFecha.plusDays(i).atTime(20, 00));
                    break;
                default:
                    cuota.setFechaVencimiento(primerFecha.plusMonths(i).atTime(20, 00));
                    break;
            }

            cuota.setEstado("Pendiente");
            cuota.setMonto(credito.getCuotaMensual());
            cuota.setTotal(cuota.getMonto());
            cuota.setPagoMora(BigDecimal.ZERO);

            String codigo = cuotaService.generarCodigo();
            cuota.setCodigo(codigo);

            nuevasCuotas.add(cuota);
            cuotaService.save(cuota);
        }

        return nuevasCuotas;
    }
}