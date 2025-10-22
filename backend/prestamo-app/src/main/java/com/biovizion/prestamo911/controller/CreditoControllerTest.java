package com.biovizion.prestamo911.controller;

import static com.biovizion.prestamo911.DTOs.Credito.CreditoDTOs.mapearACreditoTablaDTOs;
import static com.biovizion.prestamo911.DTOs.Cuota.CuotaDTOs.mapearACuotaTablaDTOs;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.server.ResponseStatusException;

import com.biovizion.prestamo911.DTOs.Credito.CreditoDTOs.CreditoTablaDTO;
import com.biovizion.prestamo911.DTOs.Credito.CreditoRequestDTOs.CreditoAceptarRequest;
import com.biovizion.prestamo911.DTOs.Credito.CreditoRequestDTOs.CreditoDescargableRequest;
import com.biovizion.prestamo911.DTOs.Credito.CreditoRequestDTOs.CreditoDesembolsableRequest;
import com.biovizion.prestamo911.DTOs.Credito.CreditoRequestDTOs.CreditoDesembolsarRequest;
import com.biovizion.prestamo911.DTOs.Credito.CreditoRequestDTOs.CreditoEditableRequest;
import com.biovizion.prestamo911.DTOs.Credito.CreditoRequestDTOs.CreditoSolicitudRequest;
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
import com.biovizion.prestamo911.utils.AuthUtils;

import jakarta.servlet.http.HttpServletResponse;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@SuppressWarnings("rawtypes")
@Controller
@RequestMapping("/creditoTest")
public class CreditoControllerTest {
    @Autowired
    private CreditoService creditoService;

    @Autowired
    private CreditoCuotaService cuotaService;

    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private PdfService pdfService;

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

    // --- POST ---
    @PostMapping("/crear")
    public ResponseEntity<ApiResponse> crearCredito(@RequestBody CreditoSolicitudRequest request) {
        try {
            Optional<UsuarioEntity> usuarioOpt = usuarioService.findById(request.getUsuarioId());
            if (!usuarioOpt.isPresent()) {
                ApiResponse<String> response = new ApiResponse<>("Usuario no encontrado");
                return ResponseEntity.status(404).body(response);
            }

            if (request.getMonto().compareTo(new BigDecimal("50")) < 0) {
                ApiResponse<String> response = new ApiResponse<>("Esta no es una solicitud valida. No es posible solicitar un crédito con un monto menor a $50 (USD)");
                return ResponseEntity.status(404).body(response);
            }

            UsuarioEntity usuario = usuarioOpt.get();
            CreditoEntity creditoEntity = new CreditoEntity();
            UsuarioSolicitudEntity usuarioSolicitud = new UsuarioSolicitudEntity();

            // --- CreditoEntity ---
            if (request.getMonto().compareTo(new BigDecimal("200")) < 0) {
                creditoEntity.setTipo("rapi-cash");
            }
            else{
                creditoEntity.setTipo("prendario");
            }

            creditoEntity.setMonto(request.getMonto());
            creditoEntity.setPlazoFrecuencia(request.getFrecuenciaPago());
            creditoEntity.setDestino(request.getFinalidadCredito());
            creditoEntity.setFormaDePago(request.getFormaPago());
            creditoEntity.setTienePropiedad(request.getPropiedadANombre());
            creditoEntity.setTieneVehiculo(request.getVehiculoANombre());

            // --- UsuarioEntity ---
            usuario.setDui(request.getDui());
            usuario.setNombre(request.getNombres());
            usuario.setApellido(request.getApellidos());
            usuario.setEmail(request.getEmail());
            usuario.setCelular(request.getCelular());
            usuario.setDireccion(request.getDireccion());
            usuario.setOcupacion(request.getOcupacion());
            usuario.setTiempoResidencia(request.getTiempoResidencia());
            usuario.setEstadoCivil(request.getEstadoCivil());
            usuario.setFechaNacimiento(request.getFechaNacimiento());
            usuario.setGastosMensuales(request.getGastosMensuales());
            usuario.setFuenteConocimiento(request.getComoConocio());
            usuario.setConoceAlguien(request.getConoceAlguien());
            usuario.setPerfilRedSocial(request.getEnlaceRedSocial());

            // --- UsuarioSolicitudEntity ---
            usuarioSolicitud.setFechaSolicitud(LocalDate.now());
            usuarioSolicitud.setReferencia1(request.getNombreReferencia1());
            usuarioSolicitud.setTelefonoReferencia1(request.getCelularReferencia1());
            usuarioSolicitud.setParentesco1(request.getParentescoReferencia1());
            usuarioSolicitud.setReferencia2(request.getNombreReferencia2());
            usuarioSolicitud.setTelefonoReferencia2(request.getCelularReferencia2());
            usuarioSolicitud.setParentesco2(request.getParentescoReferencia2());
            usuarioSolicitud.setDeudas(request.getCobrosAnteriormente());
            usuarioSolicitud.setCodeudorNombre(request.getNombreCodeudor());
            usuarioSolicitud.setCodeudorDui(request.getDuiCodeudor());
            usuarioSolicitud.setCodeudorDireccion(request.getDireccionCodeudor());
            usuarioSolicitud.setIngresoMensualCodeudor(request.getIngresosMensualesCodeudor());
            usuarioSolicitud.setDuiDelanteCodeudor(request.getDuiFrenteCodeudor());
            usuarioSolicitud.setDuiAtrasCodeudor(request.getDuiAtrasCodeudor());
            usuarioSolicitud.setFotoRecibo(request.getFotoRecibo());
            usuarioSolicitud.setSolicitado(request.getSolicitadoAnteriormente());
            usuarioSolicitud.setAtrasos(
                "uno_a_dos".equals(request.getAtrasosAnteriormente()) ? UsuarioSolicitudEntity.Atrasos.uno_a_dos :
                "dos_o_mas".equals(request.getAtrasosAnteriormente()) ? UsuarioSolicitudEntity.Atrasos.dos_o_mas :
                UsuarioSolicitudEntity.Atrasos.nunca
            );
            usuarioSolicitud.setReportado(request.getReportadoAnteriormente());
            usuarioSolicitud.setOtrasDeudas(request.getDeudasActualmente());
            usuarioSolicitud.setEmpleado(
                "empleo_fijo".equals(request.getEmpleo()) ? UsuarioSolicitudEntity.Empleado.empleo_fijo :
                "negocio_propio".equals(request.getEmpleo()) ? UsuarioSolicitudEntity.Empleado.negocio_propio :
                UsuarioSolicitudEntity.Empleado.ninguno
            );

            // --- Set relationships ---
            creditoEntity.setUsuario(usuario);
            creditoEntity.setUsuarioSolicitud(usuarioSolicitud);

            // --- Save entities ---
            usuarioService.save(usuario);
            creditoService.save(creditoEntity);

            ApiResponse<String> response = new ApiResponse<>("Crédito creado exitosamente");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            ApiResponse<String> response = new ApiResponse<>("Error al crear crédito para el usuario");
            return ResponseEntity.status(500).body(response);
        }
    }

    // --- ACCIONES ---

    // -- Aceptar --
    @PostMapping("/aceptar/{id}")
    public ResponseEntity<ApiResponse> aceptarCredito(@PathVariable Long id, @RequestBody CreditoAceptarRequest request){
        try {
            CreditoEntity credito = creditoService.findById(id)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Credito no encontrado"));            

            if (request.getMontoAprobado().compareTo(new BigDecimal("200")) < 0) {
                credito.setTipo("rapi-cash");
            }
            else{
                credito.setTipo("prendario");
            }

            credito.setMonto(request.getMontoAprobado());
            credito.setPlazoFrecuencia(request.getFrecuencia());
            credito.setCuotaCantidad(request.getCuotaCantidad());
            credito.setCuotaMensual(request.getCuotaMensual());
            credito.setMora(request.getMora());
            credito.setEstado("Aceptado");
            credito.setFechaAceptado(LocalDateTime.now());
            creditoService.save(credito);

            ApiResponse<String> response = new ApiResponse<>("Crédito aceptado exitosamente!");           
            return ResponseEntity.ok(response);
        } catch (Exception e) {
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
                generarCuotas(credito.getCuotaCantidad(), request.getFechaPrimeraComision(), credito);
            }
            else{
                credito.setFechaDesembolsado(null);
                List<CreditoCuotaEntity> cuotasExistentes = cuotaService.findByCreditoId(credito.getId());

                for (CreditoCuotaEntity cuota : cuotasExistentes) {
                    cuotaService.delete(cuota.getId());
                }
            }

            creditoService.save(credito);

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