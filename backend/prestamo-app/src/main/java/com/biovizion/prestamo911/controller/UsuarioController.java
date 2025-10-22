package com.biovizion.prestamo911.controller;

import com.biovizion.prestamo911.entities.CreditoEntity;
import com.biovizion.prestamo911.entities.UsuarioAccionEntity;
import com.biovizion.prestamo911.entities.CreditoCuotaEntity;
import com.biovizion.prestamo911.service.*;
import com.biovizion.prestamo911.utils.AccionTipo;

import jakarta.servlet.http.HttpServletResponse;

import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.apache.commons.io.FilenameUtils;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import com.biovizion.prestamo911.entities.UsuarioEntity;
import com.biovizion.prestamo911.entities.UsuarioSolicitudEntity;

import java.io.File;
import java.io.IOException;
import java.security.Principal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.Optional;

@Controller
@RequestMapping("/usuario")
public class UsuarioController {
    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private UsuarioAccionService usuarioAccionService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private CreditoService creditoService;

    @Autowired
    private CreditoCuotaService creditoCuotaService;

    @Autowired
    private PdfService pdfService;

    @PostMapping("/save")
    @ResponseBody
    public ResponseEntity<?> saveUsuario(@ModelAttribute UsuarioEntity usuario,
                              @RequestParam(value = "duiDelanteFile", required = false) MultipartFile duiDelanteFile,
                              @RequestParam(value = "duiAtrasFile", required = false) MultipartFile duiAtrasFile,
                              @RequestParam(value = "celular_full", required = false) String celularFull,
                              RedirectAttributes redirectAttributes) throws IOException {
        if (celularFull != null && !celularFull.trim().isEmpty()) {
            usuario.setCelular(celularFull);
        }

        Optional<UsuarioEntity> usuarioExistente = usuarioService.findByDui(usuario.getDui());
        if (usuarioExistente.isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(Map.of("error", "Registro fallido, este DUI ya está en uso por otro usuario. Probablemente has creado una cuenta anteriormente"));
        }


        // Manejo de fotos DUI
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

        // Configuración de usuario
        usuario.setActivo(true); // ya no necesitas verificación
        usuario.setPassword(passwordEncoder.encode(usuario.getPassword()));
        usuario.setDui(usuario.getDui().trim());
        usuario.setRol("ROLE_USER");

        // Guardar usuario
        usuarioService.save(usuario);

        return ResponseEntity.ok(Map.of("message", "Cuenta creada correctamente"));
    }

    @GetMapping("/create")
    public String createUser(Model model) {
        model.addAttribute("usuario", new UsuarioEntity());
        return "auth/register";
    }

    @GetMapping("/panel")
    public String ShowListaUsuarios(Model model, Principal principal) {
        return "appDashboard/user/index";
    }
    
    @GetMapping("/solicitar")
    public String solicitarCreditoForm(Model model, Principal principal) {
        String currentUserName = principal.getName();
        UsuarioEntity usuario = usuarioService.findByDui(currentUserName)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado: " + currentUserName));

        CreditoEntity credito = new CreditoEntity();
        UsuarioSolicitudEntity solicitud = new UsuarioSolicitudEntity();

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

        credito.setUsuarioSolicitud(solicitud);

        model.addAttribute("credito", credito);
        model.addAttribute("isAdmin", false);
        return "appDashboard/user/formulario";
    }

    @GetMapping("/creditos")
    public String estadoDeCreditos(Model model, Principal principal) {
        String duiUsuario = principal.getName();
        UsuarioEntity usuario = usuarioService.findByDui(duiUsuario)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado"));

        // Get all credits and filtered credits by state from service layer
        List<CreditoEntity> creditos = creditoService.findByUsuarioId(usuario.getId());
        List<CreditoEntity> creditosAceptados = creditoService.findAceptadosByUsuarioId(usuario.getId());
        List<CreditoEntity> creditosPendientes = creditoService.findPendientesByUsuarioId(usuario.getId());
        List<CreditoEntity> creditosRechazados = creditoService.findRechazadosByUsuarioId(usuario.getId());
        List<CreditoEntity> creditosFinalizados = creditoService.findFinalizadosByUsuarioId(usuario.getId());

        // Add all credit lists to the model
        model.addAttribute("creditos", creditos);
        model.addAttribute("creditosAceptados", creditosAceptados);
        model.addAttribute("creditosPendientes", creditosPendientes);
        model.addAttribute("creditosRechazados", creditosRechazados);
        model.addAttribute("creditosFinalizados", creditosFinalizados);

        return "appDashboard/user/misCreditos";
    }

    @GetMapping("/pagar")
    public String pagarCredito(Model model, Principal principal) {
        String duiUsuario = principal.getName();
        UsuarioEntity usuario = usuarioService.findByDui(duiUsuario)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado"));

        List<CreditoEntity> creditosAceptados = creditoService.findAceptadosByUsuarioId(usuario.getId());

        model.addAttribute("creditosAceptados", creditosAceptados);
        return "appDashboard/user/pagar";
    }

    @GetMapping("/creditos/detalle/{id}/modal")
    public String creditoDetalleModal(@PathVariable Long id, Model model, Principal principal) {
        String duiUsuario = principal.getName();
        UsuarioEntity usuario = usuarioService.findByDui(duiUsuario)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado"));

        CreditoEntity credito = creditoService.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        // Verify that the credit belongs to the current user
        if (!credito.getUsuario().getId().equals(usuario.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "No tienes permiso para ver este crédito");
        }

        model.addAttribute("credito", credito);
        return "appDashboard/user/creditoDetalleModal";
    }

    @GetMapping("/cuenta")
    public String redirectToUserEdit(Principal principal) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String dui = auth.getName();

        UsuarioEntity usuario = usuarioService.findByDui(dui)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con dui: " + dui));

        // Aquí rediriges al panel real que muestra los datos personales
        return "redirect:/usuario/edit/" + usuario.getId();
    }

    @GetMapping("/edit/{id}")
    public String editUsuario(@PathVariable Long id, Model model, Principal principal) {
        UsuarioEntity usuario = usuarioService.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        model.addAttribute("usuario", usuario);
        return "usuario/userEdit";
    }

    @PostMapping("/update")
    public ResponseEntity<String> updateUsuario(
            @RequestParam("id") Long id,
            @RequestParam("nombre") String nombre,
            @RequestParam("email") String email,
            @RequestParam("celular") String celular,
            @RequestParam(value = "foto", required = false) MultipartFile foto,
            @RequestParam(value = "duiDelante", required = false) MultipartFile duiDelante,
            @RequestParam(value = "duiAtras", required = false) MultipartFile duiAtras,
            Principal principal
    ) {
        UsuarioEntity usuarioActual = usuarioService.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        // Validar si es el usuarioActual actual
        boolean isCurrentUser = principal != null && principal.getName().equals(usuarioActual.getDui());


        usuarioActual.setNombre(nombre);
        usuarioActual.setEmail(email);
        usuarioActual.setCelular(celular);

        // Ruta donde se guardan todas las imágenes
        String rutaFotos = "/opt/prestamo911/fotos-usuarios/";

        try {
            if (foto != null && !foto.isEmpty()) {
                String extension = FilenameUtils.getExtension(foto.getOriginalFilename()).toLowerCase().trim();
                String nombreArchivo = UUID.randomUUID().toString() + "." + extension;
                foto.transferTo(new File(rutaFotos + nombreArchivo));
                usuarioActual.setFoto("/fotos-usuarios/" + nombreArchivo);
            }

            if (duiDelante != null && !duiDelante.isEmpty()) {
                String extension = FilenameUtils.getExtension(duiDelante.getOriginalFilename()).toLowerCase().trim();
                String nombreArchivo = UUID.randomUUID().toString() + "." + extension;
                duiDelante.transferTo(new File(rutaFotos + nombreArchivo));
                usuarioActual.setDuiDelante("/fotos-usuarios/" + nombreArchivo);
            }

            if (duiAtras != null && !duiAtras.isEmpty()) {
                String extension = FilenameUtils.getExtension(duiAtras.getOriginalFilename()).toLowerCase().trim();
                String nombreArchivo = UUID.randomUUID().toString() + "." + extension;
                duiAtras.transferTo(new File(rutaFotos + nombreArchivo));
                usuarioActual.setDuiAtras("/fotos-usuarios/" + nombreArchivo);
            }

        } catch (IOException e) {
            e.printStackTrace();
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error al guardar archivos");
        }

        usuarioService.update(usuarioActual);

        if (isCurrentUser && !email.equals(principal.getName())) {
            return ResponseEntity.ok("emailChanged=true");
        }

        // Registrar Accion
        UsuarioAccionEntity usuarioAccion = new UsuarioAccionEntity();
        usuarioAccion.setAccion(AccionTipo.USUARIO_EDITADO);
        usuarioAccion.setUsuario(usuarioActual);
        usuarioAccionService.save(usuarioAccion);
        
        return ResponseEntity.ok("Usuario actualizado correctamente");
    }


    @PostMapping("/delete/{id}")
    public String deleteUsuario(@PathVariable Long id) {
        usuarioService.delete(id);
        return "redirect:/usuario/panel";
    }

    @GetMapping("/credito/cuotas/{id}")
    public String creditoCuotas(@PathVariable Long id, Model model, Principal principal) {
        String duiUsuario = principal.getName();

        UsuarioEntity usuario = usuarioService.findByDui(duiUsuario)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado"));

        CreditoEntity credito = creditoService.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        // Verify that the credit belongs to the current user
        if (!credito.getUsuario().getId().equals(usuario.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "No tienes permiso para ver este crédito");
        }

        List<CreditoCuotaEntity> cuotas = creditoCuotaService.findByCreditoId(id);
        List<CreditoCuotaEntity> cuotasPendientes = creditoCuotaService.findPendientesByCreditoId(id);
        List<CreditoCuotaEntity> cuotasEnRevision = creditoCuotaService.findEnRevisionByCreditoId(id);
        List<CreditoCuotaEntity> cuotasPagadas = creditoCuotaService.findPagadasByCreditoId(id);
        List<CreditoCuotaEntity> cuotasVencidas = creditoCuotaService.findVencidasByCreditoId(id);

        // Add all cuota lists to the model
        model.addAttribute("cuotas", cuotas);
        model.addAttribute("cuotasPendientes", cuotasPendientes);
        model.addAttribute("cuotasEnRevision", cuotasEnRevision);
        model.addAttribute("cuotasPagadas", cuotasPagadas);
        model.addAttribute("cuotasVencidas", cuotasVencidas);

        return "appDashboard/user/cuotas";
    }

    @GetMapping("/simular")
    public String Simular() {
        return "appDashboard/user/simular";
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

    @PostMapping("/pdf/{id}")
    public void usuarioSolicitudPDF(@PathVariable("id") Long usuarioId,
                                    HttpServletResponse response,
                                    Principal principal) {
        Optional<UsuarioEntity> usuarioOpt = usuarioService.findById(usuarioId);
        UsuarioEntity usuario = usuarioOpt.get();
        
        List<CreditoEntity> creditos =  creditoService.findByUsuarioId(usuarioId);

        UsuarioEntity usuarioActual = usuarioService.findByDui(principal.getName())
        .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado"));

        UsuarioAccionEntity usuarioAccion = new UsuarioAccionEntity();
        usuarioAccion.setAccion(AccionTipo.DESCARGADO_PDF_ADMIN);
        usuarioAccion.setUsuario(usuarioActual);
        usuarioAccion.setUsuarioAfectado(usuario);
        usuarioAccionService.save(usuarioAccion);

        pdfService.generarUsuarioInformePDF(usuario, creditos, response);
    }
}
