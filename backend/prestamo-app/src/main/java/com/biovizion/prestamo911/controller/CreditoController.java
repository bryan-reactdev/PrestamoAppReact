package com.biovizion.prestamo911.controller;

import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.time.LocalDate;
import java.util.List;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;
import java.math.BigDecimal;
import java.security.Principal;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.UUID;
import java.util.function.BiConsumer;
import java.util.function.Consumer;

import com.biovizion.prestamo911.entities.UsuarioEntity;
import com.biovizion.prestamo911.service.PdfService;
import com.biovizion.prestamo911.service.UsuarioAccionService;
import com.biovizion.prestamo911.service.UsuarioService;
import com.biovizion.prestamo911.utils.AccionTipo;

import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import com.biovizion.prestamo911.entities.BalanceEntity;
import com.biovizion.prestamo911.entities.CreditoCuotaEntity;
import com.biovizion.prestamo911.entities.CreditoEntity;
import com.biovizion.prestamo911.entities.NotaEntity;
import com.biovizion.prestamo911.entities.UsuarioAccionEntity;
import com.biovizion.prestamo911.entities.UsuarioSolicitudEntity;
import com.biovizion.prestamo911.service.BalanceService;
import com.biovizion.prestamo911.service.CreditoCuotaService;
import com.biovizion.prestamo911.service.CreditoService;
import com.biovizion.prestamo911.service.NotaService;

import javax.imageio.ImageIO;

@Controller
@RequestMapping("/credito")
public class CreditoController {
    @Autowired
    private BalanceService balanceService;
    
    @Autowired
    private CreditoService creditoService;

    @Autowired
    private NotaService notaService;

    @Autowired
    private CreditoCuotaService creditoCuotaService;

    @Autowired
    private UsuarioService usuarioService;
    
    @Autowired
    private UsuarioAccionService usuarioAccionService;
    
    @Autowired
    private PdfService pdfService;


    public static class RefinanciableCreditoDTO {
        private final Long creditoId;
    	private final String nombreCompleto;
    	private final BigDecimal monto;
    	private final String plazoFrecuencia;
    	private final LocalDate fechaSolicitud;
        private final List<Map<String, Object>> cuotas;

        public RefinanciableCreditoDTO(Long creditoId, String nombreCompleto, BigDecimal monto, String plazoFrecuencia, LocalDate fechaSolicitud, List<Map<String, Object>> cuotas) {
            this.creditoId = creditoId;
    		this.nombreCompleto = nombreCompleto;
    		this.monto = monto;
    		this.plazoFrecuencia = plazoFrecuencia;
    		this.fechaSolicitud = fechaSolicitud;
            this.cuotas = cuotas;
    	}

        public Long getCreditoId() { return creditoId; }
    	public String getNombreCompleto() { return nombreCompleto; }
    	public BigDecimal getMonto() { return monto; }
    	public String getPlazoFrecuencia() { return plazoFrecuencia; }
    	public LocalDate getFechaSolicitud() { return fechaSolicitud; }
        public List<Map<String, Object>> getCuotas() { return cuotas; }
    }


    @PostMapping("/pagar/{id}")
    public void pagarCuotaYGenerarPDF(@PathVariable Long id,
                                      @RequestParam("monto") BigDecimal montoPago,
                                      HttpServletResponse response) {
        try {
            CreditoCuotaEntity cuota = creditoCuotaService.findById(id)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Cuota no encontrada"));

            CreditoEntity credito = cuota.getCredito();

            cuota.setEstado("EnRevision");
            cuota.setFechaPago(LocalDate.now().atTime(20, 00));
            
            creditoCuotaService.save(cuota);

            long pagadas = creditoCuotaService.findPagadasByCreditoId(credito.getId()).size();

            if (pagadas >= credito.getCuotaCantidad()) {
                credito.setEstado("Finalizado");
            }


            creditoService.save(credito);

            // Generar y devolver PDF
            pdfService.generarFacturaPDF(cuota, response);

        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error procesando pago", e);
        }
    }


    @GetMapping("/form")
    public String creditoForm(Model model) {
        CreditoEntity credito = new CreditoEntity();
        credito.setUsuarioSolicitud(new UsuarioSolicitudEntity()); // initialize nested object

        model.addAttribute("credito", credito);
        return "credito/creditoForm";
    }

    @PostMapping("/save")
    public String saveCredito(
            @ModelAttribute CreditoEntity credito,
            @RequestParam(required = false) Long userId,
            @RequestParam(required = false) String formaDePagoOtro,
            @RequestParam(required = false) String destinoOtro,
            @RequestParam(value = "duiDelante", required = false) MultipartFile duiDelanteFile,
            @RequestParam(value = "duiAtras", required = false) MultipartFile duiAtrasFile,
            @RequestParam(value = "duiDelanteCodeudor", required = false) MultipartFile duiDelanteCodeudorFile,
            @RequestParam(value = "duiAtrasCodeudor", required = false) MultipartFile duiAtrasCodeudorFile,
            @RequestParam(value = "fotoRecibo", required = false) MultipartFile fotoReciboFile,
            Principal principal
    ) throws IOException {

        UsuarioEntity usuarioBD;

        if (userId == null) {
            usuarioBD = usuarioService.findByDui(principal.getName())
                    .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        } else {
            usuarioBD = usuarioService.findById(userId)
                    .orElseThrow(() -> new RuntimeException("Usuario no encontrado con ID: " + userId));
        }

        // Mezclar los datos que vienen del formulario para no perderlos
        UsuarioEntity usuarioForm = credito.getUsuario();
        if (usuarioForm != null) {
            usuarioBD.setFuenteConocimiento(usuarioForm.getFuenteConocimiento());
            usuarioBD.setConoceAlguien(usuarioForm.getConoceAlguien());
            usuarioBD.setNombrePersonaConocida(usuarioForm.getNombrePersonaConocida());
            usuarioBD.setTelefonoPersonaConocida(usuarioForm.getTelefonoPersonaConocida());
            usuarioBD.setPerfilRedSocial(usuarioForm.getPerfilRedSocial());
            usuarioBD.setGastosMensuales(usuarioForm.getGastosMensuales());
            usuarioBD.setTiempoResidencia(usuarioForm.getTiempoResidencia());
            credito.setUsuario(usuarioBD);
        } else {
            credito.setUsuario(usuarioBD);
        }

        String rutaFotos = "/opt/prestamo911/fotos-usuarios/";

        BiConsumer<MultipartFile, Consumer<String>> guardarJPG = (file, setter) -> {
            try {
                if (file != null && !file.isEmpty()) {
                    String nombreArchivo = UUID.randomUUID() + ".jpg";
                    BufferedImage bufferedImage = ImageIO.read(file.getInputStream());
                    if (bufferedImage == null) {
                        throw new IllegalArgumentException("No se pudo leer la imagen. Asegúrese de que el archivo sea una imagen válida (JPG, PNG, etc.).");
                    }
                    ImageIO.write(bufferedImage, "jpg", new File(rutaFotos + nombreArchivo));
                    setter.accept("/fotos-usuarios/" + nombreArchivo);
                }
            } catch (IOException e) {
                throw new RuntimeException("Error al guardar imagen: " + e.getMessage(), e);
            }
        };

        guardarJPG.accept(duiDelanteFile, credito.getUsuarioSolicitud() != null ? credito.getUsuarioSolicitud()::setDuiDelante : s -> {});
        guardarJPG.accept(duiAtrasFile, credito.getUsuarioSolicitud() != null ? credito.getUsuarioSolicitud()::setDuiAtras : s -> {});
        guardarJPG.accept(duiDelanteCodeudorFile, credito.getUsuarioSolicitud() != null ? credito.getUsuarioSolicitud()::setDuiDelanteCodeudor : s -> {});
        guardarJPG.accept(duiAtrasCodeudorFile, credito.getUsuarioSolicitud() != null ? credito.getUsuarioSolicitud()::setDuiAtrasCodeudor : s -> {});
        guardarJPG.accept(fotoReciboFile, credito.getUsuarioSolicitud() != null ? credito.getUsuarioSolicitud()::setFotoRecibo : s -> {});

        if ("otro".equals(credito.getFormaDePago()) && formaDePagoOtro != null && !formaDePagoOtro.trim().isEmpty()) {
            credito.setFormaDePago(formaDePagoOtro.trim());
        }

        if ("otro".equals(credito.getDestino()) && destinoOtro != null && !destinoOtro.trim().isEmpty()) {
            credito.setDestino(destinoOtro.trim());
        }

        // Guardar todo
        creditoService.save(credito);

        UsuarioEntity usuarioActual = usuarioService.findByDui(principal.getName())
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado"));

        boolean isAdmin = !"ROLE_USER".equals(usuarioActual.getRol());

        if (isAdmin) {
            return "redirect:/admin/usuarios";
        }

        return "redirect:/usuario/creditos";
    }


    @GetMapping("/dashboardPendientes")
    public String creditoDashboardPendientes(Model model) {
        List<CreditoEntity> creditos = creditoService.findPendientes();
        model.addAttribute("creditos", creditos);

        return "credito/creditoDashboardPendientes";
    }

    @GetMapping("/dashboardAceptadas")
    public String creditoDashboardAceptados(Model model) {
        List<CreditoEntity> creditos = creditoService.findAceptados();
        model.addAttribute("creditos", creditos);

        return "credito/creditoDashboardAceptadas";
    }
    @PostMapping("/update")
    public String creditoUpdate(@ModelAttribute CreditoEntity credito) {
        creditoService.update(credito);
        return "redirect:/credito/edit/" + credito.getId();
    }

    @PostMapping("/delete/{id}")
    public String creditoDelete(@PathVariable Long id) {
        creditoService.delete(id);
        return "redirect:/credito/dashboard";
    }

    @PostMapping("/accept-with-charges")
    public ResponseEntity<Map<String, Object>> acceptWithCharges(@RequestParam("creditoId") Long creditoId,
                                    @RequestParam("montoAprobado") BigDecimal montoAprobado,
                                    @RequestParam("cuotaMensualFinal") BigDecimal cuotaMensualFinal,
                                    @RequestParam("cuotaCantidad") int cuotaCantidad,
                                    @RequestParam("mora") BigDecimal mora,
                                    @RequestParam("plazoFrecuencia") String plazoFrecuencia,
                                    Principal principal) {
        CreditoEntity credito = creditoService.findById(creditoId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Credito not found"));

        credito.setMonto(montoAprobado);
        credito.setCuotaCantidad(cuotaCantidad);
        credito.setCuotaMensual(cuotaMensualFinal);
        credito.setMora(mora);
        credito.setPlazoFrecuencia(plazoFrecuencia);

        credito.setEstado("Aceptado");
        credito.setFechaAceptado(LocalDateTime.now());

        creditoService.save(credito);

        UsuarioEntity usuarioActual = usuarioService.findByDui(principal.getName())
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado"));

        // Registrar Accion
        UsuarioAccionEntity nuevaUsuarioAccion = new UsuarioAccionEntity();
        nuevaUsuarioAccion.setAccion(AccionTipo.ACEPTADO_CREDITO_ADMIN);
        nuevaUsuarioAccion.setUsuario(usuarioActual);
        nuevaUsuarioAccion.setUsuarioAfectado(credito.getUsuario());
        usuarioAccionService.save(nuevaUsuarioAccion);
        
        return ResponseEntity.ok(Map.of(
            "message", "Crédito aceptado exitosamente"
        ));
    }

    @GetMapping("/edit/{id}")
    public String editarCreditoForm(@PathVariable Long id, Model model, Principal principal) {
        CreditoEntity credito = creditoService.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Crédito no encontrado"));
            
            UsuarioEntity usuarioActual = usuarioService.findByDui(principal.getName())
            .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado"));

        boolean isAdmin = !"ROLE_USER".equals(usuarioActual.getRol());

        // Validar accesso
        if (!isAdmin && !credito.getEditable()) {
            return "redirect:/usuario/creditos";
        }
        
        model.addAttribute("isAdmin", isAdmin);
        model.addAttribute("credito", credito);
        return "appDashboard/admin/formularioEdit";
    }

    @PostMapping("/update/{id}")
    public String updateCredito(
            @PathVariable Long id,
            @ModelAttribute CreditoEntity creditoActualizado,
            @RequestParam(required = false) Long userId,
            @RequestParam(required = false) String formaDePagoOtro,
            @RequestParam(required = false) String destinoOtro,
            @RequestParam(value = "duiDelante", required = false) MultipartFile duiDelanteFile,
            @RequestParam(value = "duiAtras", required = false) MultipartFile duiAtrasFile,
            @RequestParam(value = "duiDelanteCodeudor", required = false) MultipartFile duiDelanteCodeudorFile,
            @RequestParam(value = "duiAtrasCodeudor", required = false) MultipartFile duiAtrasCodeudorFile,
            @RequestParam(value = "fotoRecibo", required = false) MultipartFile fotoReciboFile,
            @RequestParam(value = "nuevaFechaAceptado", required = false) LocalDate fechaAceptado,
            Principal principal
    ) throws IOException {
        CreditoEntity credito = creditoService.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Crédito no encontrado"));
            
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String dui = auth.getName();

        UsuarioEntity usuario = usuarioService.findByDui(dui)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con dui: " + dui));
                
        // Validar accesso
        if (!"ROLE_ADMIN".equals(usuario.getRol()) && !credito.getEditable()) {
            return "redirect:/usuario/creditos";
        }

        // Cargos Financieros & Cuotas
        if ("Aceptado".equals(credito.getEstado())){
            if (fechaAceptado != null){
                LocalDateTime nuevaFecha = fechaAceptado.atStartOfDay();
                credito.setFechaAceptado(nuevaFecha);
            }

            credito.setCuotaMensual(creditoActualizado.getCuotaMensual());
            credito.setMora(creditoActualizado.getMora());
            List<CreditoCuotaEntity> cuotas = creditoCuotaService.findPendientesByCreditoId(credito.getId());

            for (CreditoCuotaEntity cuota : cuotas) {
                cuota.setMonto(creditoActualizado.getCuotaMensual());

                if (cuota.getEstado().equals("Vencido")) {
                    cuota.setPagoMora(creditoActualizado.getMora());
                }

                cuota.setTotal(cuota.getMonto().add(cuota.getPagoMora()));
                creditoCuotaService.save(cuota);
            }
        }

        // Actualizar campos simples
        credito.setMonto(creditoActualizado.getMonto());
        credito.setPlazoFrecuencia(creditoActualizado.getPlazoFrecuencia());
        credito.setCuotaCantidad(creditoActualizado.getCuotaCantidad());

        credito.setDestino("otro".equals(creditoActualizado.getDestino()) && destinoOtro != null ? destinoOtro.trim() : creditoActualizado.getDestino());
        credito.setFormaDePago("otro".equals(creditoActualizado.getFormaDePago()) && formaDePagoOtro != null ? formaDePagoOtro.trim() : creditoActualizado.getFormaDePago());

        UsuarioSolicitudEntity solicitud = credito.getUsuarioSolicitud();
        UsuarioSolicitudEntity updatedSolicitud = creditoActualizado.getUsuarioSolicitud();

        solicitud.setNombres(updatedSolicitud.getNombres());
        solicitud.setApellidos(updatedSolicitud.getApellidos());
        solicitud.setDui(updatedSolicitud.getDui());
        solicitud.setNit(updatedSolicitud.getNit());
        solicitud.setFechaNacimiento(updatedSolicitud.getFechaNacimiento());
        solicitud.setEstadoCivil(updatedSolicitud.getEstadoCivil());
        solicitud.setDireccion(updatedSolicitud.getDireccion());
        solicitud.setTelefono(updatedSolicitud.getTelefono());
        solicitud.setEmail(updatedSolicitud.getEmail());
        solicitud.setPuesto(updatedSolicitud.getPuesto());
        solicitud.setIngresoMensual(updatedSolicitud.getIngresoMensual());
        solicitud.setReferencia1(updatedSolicitud.getReferencia1());
        solicitud.setTelefonoReferencia1(updatedSolicitud.getTelefonoReferencia1());
        solicitud.setParentesco1(updatedSolicitud.getParentesco1());
        solicitud.setReferencia2(updatedSolicitud.getReferencia2());
        solicitud.setTelefonoReferencia2(updatedSolicitud.getTelefonoReferencia2());
        solicitud.setParentesco2(updatedSolicitud.getParentesco2());
        solicitud.setCodeudorNombre(updatedSolicitud.getCodeudorNombre());
        solicitud.setCodeudorDui(updatedSolicitud.getCodeudorDui());
        solicitud.setCodeudorDireccion(updatedSolicitud.getCodeudorDireccion());
        solicitud.setSolicitado(updatedSolicitud.getSolicitado());
        solicitud.setSolicitadoEntidad(updatedSolicitud.getSolicitadoEntidad());
        solicitud.setSolicitadoMonto(updatedSolicitud.getSolicitadoMonto());
        solicitud.setSolicitadoEstado(updatedSolicitud.getSolicitadoEstado());
        solicitud.setAtrasos(updatedSolicitud.getAtrasos());
        solicitud.setReportado(updatedSolicitud.getReportado());
        solicitud.setDeudas(updatedSolicitud.getDeudas());
        solicitud.setEmpleado(updatedSolicitud.getEmpleado());
        solicitud.setOtrasDeudas(updatedSolicitud.getOtrasDeudas());
        solicitud.setOtrasDeudasEntidad(updatedSolicitud.getOtrasDeudasEntidad());
        solicitud.setOtrasDeudasMonto(updatedSolicitud.getOtrasDeudasMonto());

        String rutaFotos = "/opt/prestamo911/fotos-usuarios/";
        BiConsumer<MultipartFile, Consumer<String>> guardarJPG = (file, setter) -> {
            try {
                if (file != null && !file.isEmpty()) {
                    String nombreArchivo = UUID.randomUUID() + ".jpg";
                    BufferedImage bufferedImage = ImageIO.read(file.getInputStream());
                    ImageIO.write(bufferedImage, "jpg", new File(rutaFotos + nombreArchivo));
                    setter.accept("/fotos-usuarios/" + nombreArchivo);
                }
            } catch (IOException e) {
                throw new RuntimeException("Error al guardar imagen: " + e.getMessage(), e);
            }
        };

        guardarJPG.accept(duiDelanteFile, solicitud::setDuiDelante);
        guardarJPG.accept(duiAtrasFile, solicitud::setDuiAtras);
        guardarJPG.accept(duiDelanteCodeudorFile, solicitud::setDuiDelanteCodeudor);
        guardarJPG.accept(duiAtrasCodeudorFile, solicitud::setDuiAtrasCodeudor);
        guardarJPG.accept(fotoReciboFile, solicitud::setFotoRecibo);

        UsuarioEntity usuarioActual = usuarioService.findByDui(principal.getName())
        .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado"));
        
        if (!("ROLE_ADMIN".equals(usuarioActual.getRol()))){
            credito.setEditable(false);
        }

        boolean isAdmin = !"ROLE_USER".equals(usuarioActual.getRol());
        
        // TODO: Editado por Usuario 
        
        if (isAdmin) {
            UsuarioAccionEntity usuarioAccion = new UsuarioAccionEntity();
            usuarioAccion.setUsuario(usuarioActual);
            usuarioAccion.setAccion(AccionTipo.EDITADO_CREDITO_ADMIN);
            usuarioAccion.setUsuarioAfectado(credito.getUsuario());
            creditoService.save(credito);
            usuarioAccionService.save(usuarioAccion);

            return "redirect:/admin/creditos";
        }

        return "redirect:/usuario/creditos";
    }

    List<CreditoCuotaEntity> generarCuotas(Integer cantidadCuotas, LocalDate proximoPago, CreditoEntity credito){
        return generarCuotas(cantidadCuotas, proximoPago, credito, false);
    }

    List<CreditoCuotaEntity> generarCuotas(Integer cantidadCuotas, LocalDate proximoPago, CreditoEntity credito, boolean nuevo){
        List<CreditoCuotaEntity> nuevasCuotas = new java.util.ArrayList<>();

        for (int i = (nuevo ? 1 : 0); i < (nuevo ? cantidadCuotas + 1 : cantidadCuotas) ; i++) {
            CreditoCuotaEntity cuota = new CreditoCuotaEntity();
            cuota.setCredito(credito);
            
            // Calcular dependiendo de la frecuencia
            switch (credito.getPlazoFrecuencia()) {
                case "Mensual":
                    cuota.setFechaVencimiento(proximoPago.plusMonths(i).atTime(20, 00));
                    break;
                case "Quincenal":
                    cuota.setFechaVencimiento(proximoPago.plusDays(15 * i).atTime(20, 00));
                    break;
                case "Semanal":
                    cuota.setFechaVencimiento(proximoPago.plusWeeks(i).atTime(20, 00));
                    break;
                case "Diaria":
                    cuota.setFechaVencimiento(proximoPago.plusDays(i).atTime(20, 00));
                    break;
                default:
                    cuota.setFechaVencimiento(proximoPago.plusMonths(i).atTime(20, 00));
                    break;
            }

            cuota.setEstado("Pendiente");
            cuota.setMonto(credito.getCuotaMensual());
            cuota.setTotal(cuota.getMonto());
            cuota.setPagoMora(BigDecimal.ZERO);

            String codigo = creditoCuotaService.generarCodigo();
            cuota.setCodigo(codigo);

            nuevasCuotas.add(cuota);
            creditoCuotaService.save(cuota);
        }

        return nuevasCuotas;
    }

    @PostMapping("/desembolsar/{id}")
    public ResponseEntity<Void> desembolsar(@PathVariable Long id,
                                                        Principal principal,
                                                        @RequestBody Map<String, Object> payload) {
        try {
            boolean desembolsar = Boolean.parseBoolean(payload.get("desembolsar").toString());
            Object fechaObj = payload.get("fecha");
            LocalDateTime fechaDesembolso = null;
            Object fechaPrimerObj = payload.get("fechaPrimer");
            LocalDateTime fechaPrimer = null;

            if (fechaObj != null) {
                String fecha = fechaObj.toString();
                LocalDate fechaParsed = LocalDate.parse(fecha);
                LocalTime nowTime = LocalTime.now();
                fechaDesembolso = LocalDateTime.of(fechaParsed, nowTime);
            }

            if (fechaPrimerObj != null) {
                String fecha = fechaPrimerObj.toString();
                LocalDate fechaParsed = LocalDate.parse(fecha);
                LocalTime nowTime = LocalTime.now();
                fechaPrimer = LocalDateTime.of(fechaParsed, nowTime);
            }
            
            CreditoEntity credito = creditoService.findById(id)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
    
            credito.setDesembolsado(desembolsar);
            if (desembolsar == true){
                if (fechaDesembolso == null){
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
                }
                if (fechaPrimer == null){
                    fechaPrimer = fechaDesembolso;
                }
                
                if (credito.getMontoDado() != null && credito.getMontoDado().compareTo(BigDecimal.ZERO) > 0){
                    balanceService.get().setSaldo(balanceService.get().getSaldo().subtract(credito.getMontoDado()));
                }else{
                    balanceService.get().setSaldo(balanceService.get().getSaldo().subtract(credito.getMonto()));
                }

                generarCuotas(credito.getCuotaCantidad(), fechaPrimer.toLocalDate(), credito, true);
                credito.setProximoPago(fechaDesembolso.toLocalDate());
                credito.setFechaDesembolsado(fechaDesembolso);
            }
            else {
                List<CreditoCuotaEntity> cuotas = creditoCuotaService.findByCreditoId(credito.getId());

                for (CreditoCuotaEntity cuota : cuotas) {
                    creditoCuotaService.delete(cuota.getId());
                }

                if (credito.getMontoDado() != null && credito.getMontoDado().compareTo(BigDecimal.ZERO) > 0){
                    balanceService.get().setSaldo(balanceService.get().getSaldo().add(credito.getMontoDado()));
                }else{
                    balanceService.get().setSaldo(balanceService.get().getSaldo().add(credito.getMonto()));
                }

                credito.getCuotas().clear();
                credito.setProximoPago(null);
                credito.setFechaDesembolsado(null);
            }

            creditoService.save(credito);
    
            UsuarioEntity usuarioActual = usuarioService.findByDui(principal.getName())
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado"));
    
            UsuarioAccionEntity usuarioAccion = new UsuarioAccionEntity();
            usuarioAccion.setAccion(desembolsar ? AccionTipo.DESEMBOLSADO_CREDITO_ADMIN : AccionTipo.REVERTIR_DESEMBOLSADO_CREDITO_ADMIN);
            usuarioAccion.setUsuario(usuarioActual);
            usuarioAccion.setUsuarioAfectado(credito.getUsuario());
            usuarioAccionService.save(usuarioAccion);
    
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/notas/{cuotaId}")
    public ResponseEntity<Void> addNota(
            @PathVariable Long cuotaId,
            @RequestBody Map<String, Object> payload) {
        try {
            System.out.println("ran");

            // Get the 'nota' value from the JSON
            String notaContenido = (String) payload.get("nota");

            // Fetch the cuota entity
            CreditoCuotaEntity cuota = creditoCuotaService.findById(cuotaId)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Cuota no encontrada"));

            // Create and populate NotaEntity
            NotaEntity nota = new NotaEntity();
            nota.setContenido(notaContenido);
            nota.setFecha(LocalDateTime.now());
            nota.setCuota(cuota);

            notaService.save(nota);

            return ResponseEntity.ok().build();
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("/notas/editar/{cuotaId}")
    public ResponseEntity<Void> editarNotas(
            @PathVariable Long cuotaId,
            @RequestBody List<Map<String, String>> notasActualizadas) {

        try {
           
            for (Map<String, String> notaData : notasActualizadas) {
                Long notaId = Long.parseLong(notaData.get("id"));
                String nuevoContenido = notaData.get("contenido");

                NotaEntity nota = notaService.findById(notaId)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Nota no encontrada"));

                nota.setContenido(nuevoContenido);
                notaService.save(nota);
            }

            return ResponseEntity.ok().build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/refinanciar/{creditoNuevoId}")
    public ResponseEntity<Map<String, Object>> checkRefinanciable(@PathVariable Long creditoNuevoId){
        CreditoEntity creditoNuevo = creditoService.findById(creditoNuevoId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Crédito nuevo no encontrado"));

        List<CreditoEntity> aceptados = creditoService.findAceptadosByUsuarioId(creditoNuevo.getUsuario().getId());

        CreditoEntity creditoAnterior = aceptados.stream()
                .filter(c -> !c.getId().equals(creditoNuevoId))
                .findFirst()
                .orElseThrow(() -> new ResponseStatusException(
                    HttpStatus.NOT_FOUND, 
                    "No se encontró un crédito anterior para este usuario"
                ));
                
		List<RefinanciableCreditoDTO> datos = aceptados.stream().map(c -> {
			String nombre = c.getUsuario() != null ? c.getUsuario().getNombre() : null;
			String apellido = c.getUsuario() != null ? c.getUsuario().getApellido() : null;
			String nombreCompleto = ((nombre != null ? nombre : "") + " " + (apellido != null ? apellido : "")).trim();
			LocalDate fechaSolicitud = c.getUsuarioSolicitud() != null ? c.getUsuarioSolicitud().getFechaSolicitud() : null;
            List<Map<String, Object>> cuotas = c.getCuotas() != null ? c.getCuotas().stream()
                .filter(q -> "Pendiente".equalsIgnoreCase(q.getEstado()) || "Vencido".equalsIgnoreCase(q.getEstado()))
                .map(q -> {
                    Map<String, Object> m = new HashMap<>();
                    m.put("id", q.getId());
                    m.put("codigo", q.getCodigo());
                    m.put("fechaVencimiento", q.getFechaVencimiento());
                    m.put("fechaPago", q.getFechaPago());
                    m.put("monto", q.getMonto());
                    m.put("mora", q.getPagoMora());
                    m.put("total", q.getTotal());
                    return m;
                })
                .collect(Collectors.toList()) : Collections.<Map<String, Object>>emptyList();
            return new RefinanciableCreditoDTO(
                c.getId(),
				nombreCompleto,
				c.getMonto(),
				c.getPlazoFrecuencia(),
				fechaSolicitud,
                cuotas

			);
		}).collect(Collectors.toList());

		return ResponseEntity.ok(Map.of(
			"message", "Este crédito es refinanciable",
			"data", datos
		));
    }

    @PostMapping("/refinanciar/{creditoNuevoId}/{creditoAnteriorId}")
    public ResponseEntity<String> refinanciar(@PathVariable Long creditoNuevoId,
                                            @PathVariable Long creditoAnteriorId,
                                            @RequestBody(required = false) Map<String, Object> payload) {
        try {
            CreditoEntity creditoNuevo = creditoService.findById(creditoNuevoId)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Crédito nuevo no encontrado"));

            CreditoEntity creditoAnterior = creditoService.findById(creditoAnteriorId)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Crédito a refinanciar no encontrado"));

            // Obtener montoAprobado del payload
            BigDecimal montoAprobado = null;
            if (payload != null && payload.get("montoAprobado") != null) {
                try {
                    montoAprobado = new BigDecimal(String.valueOf(payload.get("montoAprobado")));
                } catch (Exception ex) {
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                            .body("montoAprobado inválido: " + payload.get("montoAprobado"));
                }
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("Falta el campo montoAprobado en el payload");
            }

            // Aplicar actualizaciones de cuotas si vienen en el payload
            if (payload != null && payload.get("cuotas") instanceof List) {
                @SuppressWarnings("unchecked")
                List<Map<String, Object>> cuotasPayload = (List<Map<String, Object>>) payload.get("cuotas");
                for (Map<String, Object> cData : cuotasPayload) {
                    Object idObj = cData.get("id");
                    if (idObj == null) continue;

                    Long cuotaId;
                    try {
                        cuotaId = Long.parseLong(String.valueOf(idObj));
                    } catch (NumberFormatException ex) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                .body("ID de cuota inválido: " + idObj);
                    }

                    CreditoCuotaEntity cuota = creditoCuotaService.findById(cuotaId)
                            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Cuota no encontrada: " + cuotaId));

                    // Skip cuotas that are already paid
                    if ("Pagado".equalsIgnoreCase(cuota.getEstado())) {
                        continue;
                    }

                    // Validar pertenencia de la cuota al crédito anterior
                    if (!cuota.getCredito().getId().equals(creditoAnterior.getId())) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                .body("La cuota " + cuotaId + " no pertenece al crédito a refinanciar");
                    }

                    // Actualizar monto y mora si vienen en el payload
                    if (cData.get("monto") != null) {
                        try {
                            cuota.setMonto(new BigDecimal(String.valueOf(cData.get("monto"))));
                        } catch (Exception ex) {
                            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                    .body("Monto inválido para cuota " + cuotaId);
                        }
                    }

                    if (cData.get("mora") != null) {
                        try {
                            cuota.setPagoMora(new BigDecimal(String.valueOf(cData.get("mora"))));
                        } catch (Exception ex) {
                            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                    .body("Mora inválida para cuota " + cuotaId);
                        }
                    }

                    // Recalcular total = monto + mora
                    BigDecimal montoSafe = cuota.getMonto() != null ? cuota.getMonto() : BigDecimal.ZERO;
                    BigDecimal moraSafe = cuota.getPagoMora() != null ? cuota.getPagoMora() : BigDecimal.ZERO;
                    cuota.setTotal(montoSafe.add(moraSafe));

                    creditoCuotaService.save(cuota);
                }
            }

            // Calcular total restante (pendientes + vencidas)
            List<CreditoCuotaEntity> cuotasRestantes = creditoCuotaService.findPendientesByCreditoId(creditoAnterior.getId());
            cuotasRestantes.addAll(creditoCuotaService.findVencidasByCreditoId(creditoAnterior.getId()));

            BigDecimal totalRestante = BigDecimal.ZERO;
            if (cuotasRestantes != null) {
                totalRestante = cuotasRestantes.stream()
                        .map(CreditoCuotaEntity::getTotal)
                        .reduce(BigDecimal.ZERO, BigDecimal::add);
            }

            BigDecimal nuevoMonto = montoAprobado.subtract(totalRestante);
            if (nuevoMonto.compareTo(BigDecimal.ZERO) < 0) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("El monto del nuevo crédito no puede ser menor que el total restante del crédito a refinanciar.");
            }

            // Marcar cuotas anteriores como pagadas y ajustar balances
            List<CreditoCuotaEntity> cuotasAnteriores = creditoCuotaService.findByCreditoId(creditoAnterior.getId());
            for (CreditoCuotaEntity cuota : cuotasAnteriores) {
                cuota.setEstado("Pagado");

                BalanceEntity balance = balanceService.get();
                balance.setSaldo(balance.getSaldo().add(cuota.getTotal()));

                cuota.setFechaPago(LocalDateTime.now());
                creditoCuotaService.save(cuota);
            }

            creditoAnterior.setRefinanciado(true);
            creditoAnterior.setFechaRefinanciado(LocalDateTime.now());
            creditoAnterior.setEstado("Finalizado");
            creditoNuevo.setMontoDado(nuevoMonto);

            creditoService.save(creditoAnterior);
            creditoService.save(creditoNuevo);

            return ResponseEntity.ok().build();
        } catch (ResponseStatusException e) {
            throw e;
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}