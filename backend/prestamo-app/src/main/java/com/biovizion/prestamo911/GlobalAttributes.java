package com.biovizion.prestamo911;

import com.biovizion.prestamo911.entities.MensajeEntity;
import com.biovizion.prestamo911.entities.UsuarioEntity;
import com.biovizion.prestamo911.service.MensajeService;
import com.biovizion.prestamo911.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ModelAttribute;

import java.security.Principal;
import java.util.List;

@Component
@ControllerAdvice
public class GlobalAttributes {

    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private MensajeService mensajeService;

    @ModelAttribute
    public void addUserData(Model model, Principal principal) {
        if (principal != null) {
            UsuarioEntity usuario = usuarioService.findByDui(principal.getName())
                    .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado"));

            List<MensajeEntity> mensajes = mensajeService.findByLeido(false);

            model.addAttribute("mensajesLength", mensajes.size());
            model.addAttribute("usuario", usuario);
        }
    }
}