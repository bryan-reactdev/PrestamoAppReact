package com.biovizion.prestamo911.controller;

import java.security.Principal;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.biovizion.prestamo911.entities.MensajeEntity;
import com.biovizion.prestamo911.entities.UsuarioAccionEntity;
import com.biovizion.prestamo911.entities.UsuarioEntity;
import com.biovizion.prestamo911.repository.MensajeRepository;
import com.biovizion.prestamo911.service.UsuarioAccionService;
import com.biovizion.prestamo911.service.UsuarioService;
import com.biovizion.prestamo911.utils.AccionTipo;

import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;

@Controller
@RequestMapping("/mensajes")
public class MensajeController {
    @Autowired
    private MensajeRepository mensajeRepository;

    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private UsuarioAccionService usuarioAccionService;

    @PostMapping("/")
    public String message(@ModelAttribute MensajeEntity mensaje,
                        @RequestParam(value = "telefono_full", required = false) String telefonoFull,
                        RedirectAttributes redirectAttributes) {
        
        if (telefonoFull != null && !telefonoFull.trim().isEmpty()) {
            mensaje.setTelefono(telefonoFull);
        }

        mensajeRepository.save(mensaje);
        redirectAttributes.addFlashAttribute("success", "Tu solicitud fue enviada correctamente! Nos pondremos en contacto contigo pronto.");
        return "redirect:/";
    }

    @PostMapping("/leido/{id}")
    public String marcarComoVisto(@PathVariable("id") Long mensajeId,
                                  RedirectAttributes redirectAttributes,
                                  Principal principal) {
        MensajeEntity mensaje = mensajeRepository.findById(mensajeId).orElse(null);
        if (mensaje != null) {
            mensaje.setLeido(true);

            UsuarioEntity usuarioActual = usuarioService.findByDui(principal.getName())
            .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado"));

            UsuarioAccionEntity usuarioAccion = new UsuarioAccionEntity();
            usuarioAccion.setAccion(AccionTipo.MARCADO_COMO_LEIDO_MENSAJE);
            usuarioAccion.setUsuario(usuarioActual);
            usuarioAccionService.save(usuarioAccion);

            mensajeRepository.save(mensaje);
            redirectAttributes.addFlashAttribute("success", "El mensaje ha sido marcado como leido.");
        } else {
            redirectAttributes.addFlashAttribute("error", "No se encontró el mensaje.");
        }
        return "redirect:/admin/mensajes";
    }

    @PostMapping("/no-leido/{id}")
    public String marcarComoNoVisto(@PathVariable("id") Long mensajeId,
                                  RedirectAttributes redirectAttributes,
                                  Principal principal) {
        MensajeEntity mensaje = mensajeRepository.findById(mensajeId).orElse(null);
        if (mensaje != null) {
            mensaje.setLeido(false);
            
            UsuarioEntity usuarioActual = usuarioService.findByDui(principal.getName())
            .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado"));
            
            UsuarioAccionEntity usuarioAccion = new UsuarioAccionEntity();
            usuarioAccion.setAccion(AccionTipo.MARCADO_COMO_NO_LEIDO_MENSAJE);
            usuarioAccion.setUsuario(usuarioActual);
            usuarioAccionService.save(usuarioAccion);
            
            mensajeRepository.save(mensaje);
            redirectAttributes.addFlashAttribute("success", "El mensaje ha sido marcado como no leido.");
        } else {
            redirectAttributes.addFlashAttribute("error", "No se encontró el mensaje.");
        }
        return "redirect:/admin/mensajes";
    }
}