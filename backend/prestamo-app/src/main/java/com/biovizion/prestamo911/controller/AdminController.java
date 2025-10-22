package com.biovizion.prestamo911.controller;

import org.apache.commons.io.FilenameUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import com.biovizion.prestamo911.entities.UsuarioEntity;
import com.biovizion.prestamo911.entities.UsuarioSolicitudEntity;
import com.biovizion.prestamo911.entities.UsuarioAccionEntity;
import com.biovizion.prestamo911.entities.CreditoEntity;
import com.biovizion.prestamo911.entities.HistorialBalanceEntity;
import com.biovizion.prestamo911.entities.HistorialGastoEntity;
import com.biovizion.prestamo911.entities.HistorialSaldoEntity;
import com.biovizion.prestamo911.entities.MensajeEntity;
import com.biovizion.prestamo911.DTOs.Usuario.UsuarioDTOs.UsuarioCuotasDTO;
import com.biovizion.prestamo911.entities.AbonoCuotaEntity;
import com.biovizion.prestamo911.entities.BalanceEntity;
import com.biovizion.prestamo911.entities.CreditoCuotaEntity;
import com.biovizion.prestamo911.service.UsuarioService;
import com.biovizion.prestamo911.utils.AccionResolver;
import com.biovizion.prestamo911.utils.AccionTipo;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

import jakarta.servlet.http.HttpServletResponse;

import com.biovizion.prestamo911.service.UsuarioAccionService;
import com.biovizion.prestamo911.service.CreditoService;
import com.biovizion.prestamo911.service.HistorialBalanceService;
import com.biovizion.prestamo911.service.HistorialGastoService;
import com.biovizion.prestamo911.service.HistorialSaldoService;
import com.biovizion.prestamo911.service.MensajeService;
import com.biovizion.prestamo911.service.PdfService;
import com.biovizion.prestamo911.service.AbonoCuotaService;
import com.biovizion.prestamo911.service.BalanceService;
import com.biovizion.prestamo911.service.CreditoCuotaService;

import java.util.*;
import java.io.File;
import java.io.IOException;
import java.math.BigDecimal;
import java.security.Principal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@Controller
@RequestMapping("/admin")
public class AdminController {
    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private UsuarioAccionService usuarioAccionService;
    
    @Autowired
    private AccionResolver accionResolver;

    @Autowired
    private MensajeService mensajeService;

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
    
    @Autowired
    private PdfService pdfService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // < === Paginas de Admin === >

    @GetMapping("/panel")
    public String showDashboard(Model model, Principal principal) {
        List<CreditoCuotaEntity> cuotasPagadas = creditoCuotaService.findPagadas();
        List<CreditoEntity> creditosDesembolsados = creditoService.findAllByDesembolsado(true);
        List<HistorialBalanceEntity> historialBalances = historialBalanceService.findAll();
        List<HistorialSaldoEntity> historialIngresos = historialSaldoService.findAll();
        List<HistorialGastoEntity> historialGastos = historialGastoService.findAll();

        BalanceEntity balance = balanceService.get();
        
        model.addAttribute("historialIngresosCaja", historialIngresos);
        model.addAttribute("historialGastos", historialGastos);
        model.addAttribute("cuotasPagadas", cuotasPagadas);
        model.addAttribute("creditosDesembolsados", creditosDesembolsados);
        model.addAttribute("historialBalances", historialBalances);
        model.addAttribute("saldo", balance.getSaldo());

        return "appDashboard/admin/index";
    }
    
    @GetMapping("/mensajes")
    public String showMensajes(Model model) {
        List<MensajeEntity> mensajesNoLeidos = mensajeService.findByLeido(false);
        List<MensajeEntity> mensajes = mensajeService.findByLeido(true);
        model.addAttribute("mensajesNoLeidos", mensajesNoLeidos);
        model.addAttribute("mensajes", mensajes);
        return "appDashboard/admin/mensajes";
    }

    @GetMapping("/creditos")
    public String showCreditos(Model model) {
        List<CreditoEntity> creditos = creditoService.findAll();
        List<CreditoEntity> creditosPendientes = creditoService.findPendientes();
        List<CreditoEntity> creditosAceptados = creditoService.findAceptados();
        List<CreditoEntity> creditosRechazados = creditoService.findRechazados();
        List<CreditoEntity> creditosFinalizados = creditoService.findFinalizados();
        
        model.addAttribute("creditos", creditos);
        model.addAttribute("creditosPendientes", creditosPendientes);
        model.addAttribute("creditosAceptados", creditosAceptados);
        model.addAttribute("creditosRechazados", creditosRechazados);   
        model.addAttribute("creditosFinalizados", creditosFinalizados);
        
        return "appDashboard/admin/creditos";
    }
    
    @GetMapping("/creditos/cobros")
    public String showCobros(Model model) {
        List<UsuarioCuotasDTO> usuariosConCuotas = usuarioService.findAllConCuotas();
        List<UsuarioCuotasDTO> usuariosConVencidas = usuarioService.findAllConCuotasVencidas();

        List<CreditoCuotaEntity> cuotas = creditoCuotaService.findAll();
        List<CreditoCuotaEntity> cuotasPendientes = creditoCuotaService.findPendientes();
        List<CreditoCuotaEntity> cuotasEnRevision = creditoCuotaService.findEnRevision();
        List<CreditoCuotaEntity> cuotasVencidas = creditoCuotaService.findVencidas();
        List<CreditoCuotaEntity> cuotasPagadas = creditoCuotaService.findPagadas();

        BigDecimal totalVencidas = cuotas.stream()
            .filter(c -> "Vencido".equals(c.getEstado()))
            .map(CreditoCuotaEntity::getTotal)
            .reduce(BigDecimal.ZERO, BigDecimal::add);


        BigDecimal totalPendientes = cuotas.stream()
            .filter(c -> "Pendiente".equals(c.getEstado()))
            .map(CreditoCuotaEntity::getTotal)
            .reduce(BigDecimal.ZERO, BigDecimal::add);


        BigDecimal totalPagadas = cuotas.stream()
            .filter(c -> "Pagado".equals(c.getEstado()))
            .map(CreditoCuotaEntity::getTotal)
            .reduce(BigDecimal.ZERO, BigDecimal::add);


        BigDecimal totalACobrar = totalVencidas.add(totalPendientes);

        model.addAttribute("totalVencidas", totalVencidas);
        model.addAttribute("totalPendientes", totalPendientes);
        model.addAttribute("totalACobrar", totalACobrar);
        model.addAttribute("totalPagadas", totalPagadas);
        model.addAttribute("usuarioDTOs", usuariosConCuotas);
        model.addAttribute("usuarioVencidasDTOs", usuariosConVencidas);
        model.addAttribute("cuotas", cuotas);
        model.addAttribute("cuotasPendientes", cuotasPendientes);
        model.addAttribute("cuotasEnRevision", cuotasEnRevision);
        model.addAttribute("cuotasVencidas", cuotasVencidas);
        model.addAttribute("cuotasPagadas", cuotasPagadas);

        model.addAttribute("showUsuario", true);
        
        return "appDashboard/admin/creditosCobros";
    }

    @PostMapping("/creditos/cobros/pdf")
    public void printCobradorees(Model model, HttpServletResponse response) {
        List<UsuarioCuotasDTO> usuariosConCuotas = usuarioService.findAllConCuotas();
        List<UsuarioCuotasDTO> usuariosConVencidas = usuarioService.findAllConCuotasVencidas();

        model.addAttribute("usuarioDTOs", usuariosConCuotas);
        model.addAttribute("usuarioVencidasDTOs", usuariosConVencidas);

        pdfService.generarUsuarioVencidas(usuariosConVencidas, response);
    }

    @PostMapping("/creditos/{id}/aceptar")
    public ResponseEntity<String> aceptarCredito(@PathVariable Long id) {
        try {
            CreditoEntity credito = creditoService.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
            
            // Update the credit status to "Aceptado"
            credito.setEstado("Aceptado");
            creditoService.update(credito);
            
            return ResponseEntity.ok("Crédito aceptado exitosamente");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error al aceptar el crédito: " + e.getMessage());
        }
    }
    
    @PostMapping("/creditos/{id}/rechazar")
    public ResponseEntity<String> rechazarCredito(
            @PathVariable Long id,
            @RequestParam("motivo") String motivo,
            Principal principal) {
        try {
            CreditoEntity credito = creditoService.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

            // Save the rejection note (motivo)
            credito.setNota(motivo);

            // Update the credit status to "Rechazado"
            credito.setEstado("Rechazado");
            creditoService.update(credito);

            UsuarioEntity usuarioActual = usuarioService.findByDui(principal.getName())
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado"));

            UsuarioAccionEntity usuarioAccion = new UsuarioAccionEntity();
            usuarioAccion.setAccion(AccionTipo.RECHAZADO_CREDITO_ADMIN);
            usuarioAccion.setUsuario(usuarioActual);
            usuarioAccion.setUsuarioAfectado(credito.getUsuario());
            usuarioAccionService.save(usuarioAccion);

            return ResponseEntity.ok("Crédito rechazado exitosamente");

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error al rechazar el crédito: " + e.getMessage());
        }
    }

    @GetMapping("/usuarios")
    public String showUsuarios(Model model, Principal principal) {
        List<UsuarioEntity> usuarios = usuarioService.obtenerUsuariosPorRol("ROLE_USER");
        
        UsuarioEntity usuario = usuarioService.findByDui(principal.getName())
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado"));
        
        model.addAttribute("currentUsuario", usuario);
        model.addAttribute("usuarios", usuarios);
        return "appDashboard/admin/usuarios";
    }

    @GetMapping("/usuarios/crear")
    public String crearUsuarioForm(Model model){
        model.addAttribute("usuario", new UsuarioEntity());
        return "appDashboard/admin/usuarioRegister";
    }

    @PostMapping("/usuarios/crear")
    public String crearUsuario( Principal principal,
                                @ModelAttribute UsuarioEntity usuario, 
                                RedirectAttributes redirectAttributes,
                                @RequestParam(value = "duiDelanteFile", required = false) MultipartFile duiDelanteFile,
                                @RequestParam(value = "duiAtrasFile", required = false) MultipartFile duiAtrasFile,
                                @RequestParam(value = "celular_full", required = false) String celularFull,
                                Model model) throws IOException {

        try {
            if (celularFull != null && !celularFull.trim().isEmpty()) {
                usuario.setCelular(celularFull);
            }
            Optional<UsuarioEntity> usuarioExistente = usuarioService.findByDui(usuario.getDui());
            if (usuarioExistente.isPresent()) {
                redirectAttributes.addFlashAttribute("error", "Registro fallido, este DUI ya está en uso por otro usuario. Probablemente has creado una cuenta anteriormente");
                
                return "redirect:/auth/login";
            }

            // 2. Validar email duplicado
            if (usuarioService.findByDui(usuario.getDui()).isPresent()) {
                redirectAttributes.addFlashAttribute("error", "Este email ya está registrado.");
                return "redirect:/admin/usuarios";
            }

            // 3. Manejo de fotos DUI (frente y atrás)
            String rutaFotos = "/opt/prestamo911/fotos-usuarios/";

            if (duiDelanteFile != null && !duiDelanteFile.isEmpty()) {
                String extensionDelante = FilenameUtils.getExtension(duiDelanteFile.getOriginalFilename());
                String nombreArchivoDelante = UUID.randomUUID().toString() + "." + extensionDelante;

                File destinoDelante = new File(rutaFotos + nombreArchivoDelante);
                duiDelanteFile.transferTo(destinoDelante);
                usuario.setDuiDelante("/fotos-usuarios/" + nombreArchivoDelante);
            }

            if (duiAtrasFile != null && !duiAtrasFile.isEmpty()) {
                String extensionAtras = FilenameUtils.getExtension(duiAtrasFile.getOriginalFilename());
                String nombreArchivoAtras = UUID.randomUUID().toString() + "." + extensionAtras;

                File destinoAtras = new File(rutaFotos + nombreArchivoAtras);
                duiAtrasFile.transferTo(destinoAtras);
                usuario.setDuiAtras("/fotos-usuarios/" + nombreArchivoAtras);
            }

            // 4. Generar código único
            String codigo;
            int intentos = 0;
            int maxIntentos = 10;
            do {
                codigo = generarCodigo(usuario.getNombre(), usuario.getApellido());
                intentos++;
                if (intentos > maxIntentos) {
                    redirectAttributes.addFlashAttribute("error", "No se pudo generar un código único. Intenta de nuevo.");
                    return "redirect:/admin/usuarios";
                }
            } while (usuarioService.existsByCodigo(codigo));

            usuario.setCodigo(codigo);
            usuario.setActivo(true);
            usuario.setPassword(passwordEncoder.encode(usuario.getPassword()));
            usuario.setRol("ROLE_USER");

            // 5. Guardar usuario y enviar correo
            usuario.setDui(usuario.getDui().trim());
            usuarioService.save(usuario);

            redirectAttributes.addFlashAttribute("success", "Usuario creado exitosamente.");
                
            UsuarioEntity usuarioActual = usuarioService.findByDui(principal.getName())
                    .orElseThrow(() -> new RuntimeException("Usuario no encontrado: " + principal.getName()));

            // Registrar Accion
            UsuarioAccionEntity usuarioAccion = new UsuarioAccionEntity();
            usuarioAccion.setAccion(AccionTipo.CREADO_USUARIO_ADMIN);
            usuarioAccion.setUsuario(usuarioActual);
            usuarioAccion.setUsuarioAfectado(usuario);
            usuarioAccionService.save(usuarioAccion);
            
            return "redirect:/admin/usuarios";
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("error", "Error al crear el usuario: " + e.getMessage());
            return "redirect:/admin/usuarios/crear";
        }
    }

    @GetMapping("/usuarios/{id}/solicitar")
    public String solicitarCreditoForm(Model model, @PathVariable Long id) {
        UsuarioEntity usuario = usuarioService.findById(id)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado con ID: " + id));      
                
        CreditoEntity credito = new CreditoEntity();
        UsuarioSolicitudEntity solicitud = new UsuarioSolicitudEntity();

        List<CreditoEntity> creditos = usuario.getCreditos();
        if (creditos != null && !creditos.isEmpty()) {
            credito = creditos.get(creditos.size() - 1);
            solicitud = credito.getUsuarioSolicitud();
        }
                
        solicitud.setNombres(usuario.getNombre());
        solicitud.setApellidos(usuario.getApellido());
        solicitud.setEmail(usuario.getEmail());
        solicitud.setTelefono(usuario.getCelular());
        solicitud.setDui(usuario.getDui());
        solicitud.setNit(usuario.getNit());
        solicitud.setDuiDelante(usuario.getDuiDelante());
        solicitud.setDuiAtras(usuario.getDuiAtras());
        solicitud.setSolicitado(false);
        solicitud.setReportado(false);
        solicitud.setDeudas(false);
        solicitud.setOtrasDeudas(false);
        solicitud.setFechaSolicitud(LocalDate.now());

        credito.setMonto(null);
        credito.setPlazoFrecuencia(null);
        credito.setDestino(null);
        credito.setFormaDePago(null);
        credito.setUsuarioSolicitud(solicitud);

        model.addAttribute("credito", credito);
        model.addAttribute("usuarioId", usuario.getId());
        model.addAttribute("isAdmin", true); 
        return "appDashboard/user/formulario";
    }

    @GetMapping("/usuarios/{id}/bloquear")
    public ResponseEntity<Map<String, String>> toggleBloqueoUsuario(@PathVariable Long id) {
        Optional<UsuarioEntity> optionalUsuario = usuarioService.findById(id);

        Map<String, String> respuesta = new HashMap<>();

        if (optionalUsuario.isPresent()) {
            UsuarioEntity usuario = optionalUsuario.get();
            boolean nuevoEstado = !usuario.isEnabled();
            usuario.setEnabled(nuevoEstado);
            usuarioService.save(usuario);

            String estado = nuevoEstado ? "desbloqueado" : "bloqueado";
            respuesta.put("mensaje", "El usuario ha sido " + estado + " correctamente.");
            return ResponseEntity.ok(respuesta);
        } else {
            respuesta.put("error", "Usuario no encontrado.");
            return ResponseEntity.status(404).body(respuesta);
        }
    }

    @GetMapping("/usuarios/{usuarioId}/creditos")
    public String sendToUsuarioCreditos(Model model, @PathVariable Long usuarioId) {
        UsuarioEntity usuario = usuarioService.findById(usuarioId)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado con ID: " + usuarioId));

        List<CreditoEntity> creditos = creditoService.findByUsuarioId(usuarioId);
        List<CreditoEntity> creditosAceptados = creditoService.findAceptadosByUsuarioId(usuarioId);
        List<CreditoEntity> creditosPendientes = creditoService.findPendientesByUsuarioId(usuarioId);
        List<CreditoEntity> creditosRechazados = creditoService.findRechazadosByUsuarioId(usuarioId);
        List<CreditoEntity> creditosFinalizados = creditoService.findFinalizadosByUsuarioId(usuarioId);

        model.addAttribute("creditoUsuario", usuario);
        model.addAttribute("creditos", creditos);
        model.addAttribute("creditosAceptados", creditosAceptados);
        model.addAttribute("creditosPendientes", creditosPendientes);
        model.addAttribute("creditosRechazados", creditosRechazados);
        model.addAttribute("creditosFinalizados", creditosFinalizados);

        return "appDashboard/admin/usuarioCreditos";
    }

    @GetMapping("/usuarios/{usuarioId}/creditos/{creditoId}/cuotas")
    public String sendToUsuarioCreditoCuotas(Model model, @PathVariable Long usuarioId, @PathVariable Long creditoId) {
        UsuarioEntity usuario = usuarioService.findById(usuarioId)
        .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado con ID: " + usuarioId));
        
        List<CreditoCuotaEntity> cuotas = creditoCuotaService.findByCreditoId(creditoId);
        List<CreditoCuotaEntity> cuotasPendientes = creditoCuotaService.findPendientesByCreditoId(creditoId);
        List<CreditoCuotaEntity> cuotasEnRevision = creditoCuotaService.findEnRevisionByCreditoId(creditoId);
        List<CreditoCuotaEntity> cuotasPagadas = creditoCuotaService.findPagadasByCreditoId(creditoId);
        List<CreditoCuotaEntity> cuotasVencidas = creditoCuotaService.findVencidasByCreditoId(creditoId);

        ObjectMapper mapper = new ObjectMapper();
        mapper.registerModule(new JavaTimeModule());
        mapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);

        Map<Long, String> notasJsonMap = new HashMap<>();
        for (CreditoCuotaEntity cuota : cuotas) {
            try {
                String json = mapper.writeValueAsString(cuota.getNotas());
                notasJsonMap.put(cuota.getId(), json);
            } catch (JsonProcessingException e) {
                // log error and handle gracefully
                notasJsonMap.put(cuota.getId(), "[]");
                e.printStackTrace();
            }
        }

        model.addAttribute("cuotas", cuotas);
        model.addAttribute("creditoUsuario", usuario);
        model.addAttribute("cuotasPendientes", cuotasPendientes);
        model.addAttribute("cuotasEnRevision", cuotasEnRevision);
        model.addAttribute("cuotasPagadas", cuotasPagadas);
        model.addAttribute("cuotasVencidas", cuotasVencidas);

        return "appDashboard/admin/usuarioCreditoCuotas";
    }

    @PostMapping("/usuarios/update")
    public ResponseEntity<String> updateUsuario(@ModelAttribute UsuarioEntity usuario) {
        try {
            // Obtener el usuario existente y conservar la contraseña
            UsuarioEntity usuarioExistente = usuarioService.findById(usuario.getId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

            usuario.setPassword(usuarioExistente.getPassword());

            usuarioService.update(usuario);
            return ResponseEntity.ok("Usuario actualizado exitosamente");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error al actualizar el usuario: " + e.getMessage());
        }
    }

    private String generarCodigo(String nombre, String apellido) {
        nombre = nombre.length() >= 2 ? nombre.substring(0, 2).toUpperCase() : nombre.toUpperCase();
        apellido = apellido.length() >= 1 ? apellido.substring(0, 1).toUpperCase() : "";
        int randomNum = (int)(Math.random() * 900000) + 100000; // 6 números aleatorios entre 100000 y 999999
        return nombre + apellido + randomNum;
    }

    @PostMapping("/creditos/toggle/{id}")
    public ResponseEntity<Void> toggleCredito(@PathVariable Long id,
                                            @RequestBody Map<String, Boolean> body,
                                              Principal principal) {
        CreditoEntity credito = creditoService.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        credito.setEditable(body.getOrDefault("editable", false));
        creditoService.save(credito);

        UsuarioEntity usuarioActual = usuarioService.findByDui(principal.getName())
        .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado"));

        UsuarioAccionEntity usuarioAccion = new UsuarioAccionEntity();
        usuarioAccion.setAccion(AccionTipo.EDITABLE_CREDITO_ADMIN);
        usuarioAccion.setUsuario(usuarioActual);
        usuarioAccion.setUsuarioAfectado(credito.getUsuario());
        usuarioAccionService.save(usuarioAccion);

        return ResponseEntity.ok().build();
    }
    
    @PostMapping("/creditos/toggle-descargable/{id}")
    public ResponseEntity<Void> toggleCreditoDescargable(@PathVariable Long id,
                                            @RequestBody Map<String, Boolean> body,
                                              Principal principal) {
        CreditoEntity credito = creditoService.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        credito.setDescargable(body.getOrDefault("descargable", false));
        creditoService.save(credito);

        UsuarioEntity usuarioActual = usuarioService.findByDui(principal.getName())
        .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado"));

        UsuarioAccionEntity usuarioAccion = new UsuarioAccionEntity();
        usuarioAccion.setAccion(AccionTipo.DESCARGABLE_CREDITO_ADMIN);
        usuarioAccion.setUsuario(usuarioActual);
        usuarioAccion.setUsuarioAfectado(credito.getUsuario());
        usuarioAccionService.save(usuarioAccion);

        return ResponseEntity.ok().build();
    }
    
    @PostMapping("/creditos/toggle-desembolsable/{id}")
    public ResponseEntity<Void> toggleCreditoDesembolsable(@PathVariable Long id,
                                            @RequestBody Map<String, Boolean> body,
                                              Principal principal) {
        CreditoEntity credito = creditoService.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        credito.setDesembolsable(body.getOrDefault("desembolsable", false));
        creditoService.save(credito);

        UsuarioEntity usuarioActual = usuarioService.findByDui(principal.getName())
        .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado"));

        UsuarioAccionEntity usuarioAccion = new UsuarioAccionEntity();
        usuarioAccion.setAccion(AccionTipo.DESEMBOLSABLE_CREDITO_ADMIN);
        usuarioAccion.setUsuario(usuarioActual);
        usuarioAccion.setUsuarioAfectado(credito.getUsuario());
        usuarioAccionService.save(usuarioAccion);

        return ResponseEntity.ok().build();
    }
    
    @GetMapping("/historial")
    public String mostrarHistorial(Model model) {
        List<UsuarioAccionEntity> acciones = usuarioAccionService.findAll();
        
        model.addAttribute("usuarioAcciones", acciones);
        model.addAttribute("accionResolver", accionResolver);

        return "appDashboard/admin/historial";
    }

    @PostMapping("/ingreso")
    @ResponseBody
    public ResponseEntity<String> registrarIngreso(@RequestBody Map<String, String> ingresoData,
                                Principal principal) {
        try {
            BigDecimal monto = new BigDecimal(ingresoData.get("monto"));
            String tipo = ingresoData.get("tipo");
            String motivo = ingresoData.get("motivo");
            LocalDateTime fecha = LocalDate.parse(ingresoData.get("fecha")).atTime(LocalTime.now());
            
            HistorialSaldoEntity nuevoIngreso = new HistorialSaldoEntity();
            nuevoIngreso.setTipo(tipo);
            nuevoIngreso.setMonto(monto);
            nuevoIngreso.setMotivo(motivo);
            nuevoIngreso.setFecha(fecha);

            historialSaldoService.save(nuevoIngreso);

            BalanceEntity balance = balanceService.get();
            balance.setSaldo(balance.getSaldo().add(monto));

            UsuarioEntity usuarioActual = usuarioService.findByDui(principal.getName())
            .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado"));

            UsuarioAccionEntity usuarioAccion = new UsuarioAccionEntity();
            usuarioAccion.setAccion(AccionTipo.REGISTRADO_INGRESO_ADMIN);
            usuarioAccion.setUsuario(usuarioActual);
            usuarioAccionService.save(usuarioAccion);

            return ResponseEntity.ok("Ingreso registrado");
        } catch (Exception e) {
            String msg = "Error al registrar el ingreso: " + e.getMessage();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(msg);
        }
    }

    @PostMapping("/gasto")
    @ResponseBody
    public ResponseEntity<String> registrarGasto(@RequestBody Map<String, String> gastoData,
                                Principal principal) {
        try {
            BigDecimal monto = new BigDecimal(gastoData.get("monto"));
            String tipo = gastoData.get("tipo");
            String motivo = gastoData.get("motivo");
            LocalDateTime fecha = LocalDate.parse(gastoData.get("fecha")).atTime(LocalTime.now());
            
            HistorialGastoEntity nuevoGasto = new HistorialGastoEntity();
            nuevoGasto.setTipo(tipo);
            nuevoGasto.setMonto(monto);
            nuevoGasto.setMotivo(motivo);
            nuevoGasto.setFecha(fecha);

            historialGastoService.save(nuevoGasto);
            
            BalanceEntity balance = balanceService.get();
            balance.setSaldo(balance.getSaldo().subtract(monto));

            UsuarioEntity usuarioActual = usuarioService.findByDui(principal.getName())
            .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado"));

            UsuarioAccionEntity usuarioAccion = new UsuarioAccionEntity();
            usuarioAccion.setAccion(AccionTipo.REGISTRADO_GASTO_ADMIN);
            usuarioAccion.setUsuario(usuarioActual);
            usuarioAccionService.save(usuarioAccion);

            return ResponseEntity.ok("Gasto registrado");
        } catch (Exception e) {
            String msg = "Error al registrar el gasto: " + e.getMessage();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(msg);
        }
    }

    @PostMapping("/pdf/reporte/{fecha}/ingresos")
    public void usuarioReporteDiarioIngresoPDF(@PathVariable("fecha") LocalDate fecha,
                                    HttpServletResponse response,
                                    Principal principal) {
        HistorialBalanceEntity balance = historialBalanceService.findByFecha(fecha);
        List<CreditoCuotaEntity> cuotas = creditoCuotaService.findAllByEstadoAndFechaPago("Pagado", fecha);
        List<AbonoCuotaEntity> abonos = abonoCuotaService.findAllByFecha(fecha);
        List<HistorialSaldoEntity> ingresos = historialSaldoService.findAllByFecha(fecha);
        
        UsuarioEntity usuarioActual = usuarioService.findByDui(principal.getName())
        .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado"));

        UsuarioAccionEntity usuarioAccion = new UsuarioAccionEntity();
        usuarioAccion.setAccion(AccionTipo.DESCARGADO_REPORTE_PDF_ADMIN);
        usuarioAccion.setUsuario(usuarioActual);
        usuarioAccionService.save(usuarioAccion);

        pdfService.generarReporteDiarioIngreso(balance.getMonto(), cuotas, abonos, ingresos, fecha, response);
    }
    
    @PostMapping("/pdf/reporte/{fecha}/egresos")
    public void usuarioReporteDiarioEgresoPDF(@PathVariable("fecha") LocalDate fecha,
                                    HttpServletResponse response,
                                    Principal principal) {
        HistorialBalanceEntity balance = historialBalanceService.findByFecha(fecha);
        List<CreditoEntity> creditos = creditoService.findAllByDesembolsadoAndFechaDesembolsado(true, fecha);
        List<HistorialGastoEntity> gastos = historialGastoService.findAllByFecha(fecha);
        
        UsuarioEntity usuarioActual = usuarioService.findByDui(principal.getName())
        .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado"));

        UsuarioAccionEntity usuarioAccion = new UsuarioAccionEntity();
        usuarioAccion.setAccion(AccionTipo.DESCARGADO_REPORTE_PDF_ADMIN);
        usuarioAccion.setUsuario(usuarioActual);
        usuarioAccionService.save(usuarioAccion);

        pdfService.generarReporteDiarioEgreso(balance.getMonto(), creditos, gastos, fecha, response);
    }

    @PostMapping("/pdf/cuotas/{id}")
    public void cuotasPDF(@PathVariable("id") Long id,
                        @RequestParam(value = "mostrarEstado", required = false, defaultValue = "false") boolean mostrarEstado,
                        @RequestParam(value = "mostrarObservaciones", required = false, defaultValue = "false") boolean mostrarObservaciones,
                        HttpServletResponse response,
                        Principal principal) {

        System.out.println(mostrarEstado);
        System.out.println(mostrarObservaciones);
        List<CreditoCuotaEntity> cuotas = creditoCuotaService.findByCreditoId(id);

        UsuarioEntity usuarioActual = usuarioService.findByDui(principal.getName())
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado"));

        UsuarioAccionEntity usuarioAccion = new UsuarioAccionEntity();
        usuarioAccion.setAccion(AccionTipo.DESCARGADO_CUOTAS_PDF_ADMIN);
        usuarioAccion.setUsuario(usuarioActual);
        usuarioAccion.setUsuarioAfectado(cuotas.get(0).getCredito().getUsuario());
        usuarioAccionService.save(usuarioAccion);

        pdfService.generarCuotasPDF(cuotas, mostrarEstado, mostrarObservaciones, response);
    }


    @GetMapping("/test/password/{password}")
    public String testPassword(@PathVariable String password){
        System.out.println(password);
        System.out.println(passwordEncoder.encode(password.trim()));

        return "redirect:/admin/panel";
    }

    @PostMapping("/credito/riesgo/{creditoId}")
    public ResponseEntity<Void> guardarAnalisisRiesgo(
            @PathVariable Long creditoId,
            @RequestBody List<Map<String, String>> analisis,
            Principal principal) {

        // Find credito or 404
        CreditoEntity credito = creditoService.findById(creditoId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        analisis.forEach(entry -> {
            String criterio = entry.get("criterio");
            String valor = entry.get("valor");

            if (criterio == null || valor == null) return;

            switch (criterio.trim()) {
                case "Capacidad de pago":
                    credito.setCapacidadPago(valor);
                    break;
                case "Estabilidad Laboral":
                    credito.setEstabilidadLaboral(valor);
                    break;
                case "Historial Crediticio":
                    credito.setHistorialCrediticio(valor);
                    break;
                case "Nivel de Endeudamiento":
                    credito.setNivelEndeudamiento(valor); // typo in column/field?
                    break;
                case "Recomendación":
                    credito.setRecomendacion(valor);
                    break;
                default:
                    System.out.println("Criterio no reconocido: " + criterio);
                    break;
            }
        });

        creditoService.save(credito);

        return ResponseEntity.ok().build();
    }



    @PostMapping("/change-password")
    @ResponseBody
    public ResponseEntity<String> cambiarContrasena(
            @RequestParam("usuarioId") Long usuarioId,
            @RequestParam("nuevaContrasena") String nuevaContrasena) {
        try {
            // Obtener usuario
            UsuarioEntity usuario = usuarioService.findById(usuarioId)
                    .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

            // Encriptar contraseña y guardar
            usuario.setPassword(passwordEncoder.encode(nuevaContrasena));
            usuarioService.save(usuario);

            return ResponseEntity.ok("Contraseña cambiada correctamente");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Error: " + e.getMessage());
        }
    }

}