package com.biovizion.prestamo911.controller;

import com.biovizion.prestamo911.entities.UsuarioEntity;

import java.security.Principal;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import com.biovizion.prestamo911.entities.CreditoEntity;
import com.biovizion.prestamo911.entities.UsuarioAccionEntity;
import com.biovizion.prestamo911.entities.UsuarioSolicitudEntity;
import com.biovizion.prestamo911.service.CreditoService;
import com.biovizion.prestamo911.service.PdfService;
import com.biovizion.prestamo911.service.UsuarioAccionService;
import com.biovizion.prestamo911.service.UsuarioService;
import com.biovizion.prestamo911.service.UsuarioSolicitudService;
import com.biovizion.prestamo911.utils.AccionTipo;

import jakarta.servlet.http.HttpServletResponse;

@Controller
@RequestMapping("/solicitud")
public class UsuarioSolicitudController {

    @Autowired
    private UsuarioSolicitudService usuarioSolicitudService;

    @Autowired
    private CreditoService creditoService;

    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private UsuarioAccionService usuarioAccionService;

    @Autowired
    private PdfService pdfService;

    @PostMapping("/pdf/{id}/{nombre}")
    public void usuarioSolicitudPDF(@PathVariable("id") Long creditoId,
                                    @PathVariable("nombre") String pdfNombre,
                                    HttpServletResponse response,
                                    Principal principal) {
        CreditoEntity credito = creditoService.findById(creditoId)
            .orElseThrow(() -> new RuntimeException("No existe el credito con id " + creditoId));

        UsuarioSolicitudEntity usuarioSolicitud = usuarioSolicitudService.findById(credito.getUsuarioSolicitud().getId())
            .orElseThrow(() -> new RuntimeException("No existe el usuarioSolicitud con id " + credito.getUsuarioSolicitud().getId()));

        UsuarioEntity usuario = credito.getUsuario();

        UsuarioEntity usuarioActual = usuarioService.findByDui(principal.getName())
        .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado"));

        UsuarioAccionEntity usuarioAccion = new UsuarioAccionEntity();
        usuarioAccion.setAccion(AccionTipo.DESCARGADO_PDF_ADMIN);
        usuarioAccion.setUsuario(usuarioActual);
        usuarioAccion.setUsuarioAfectado(usuario);
        usuarioAccionService.save(usuarioAccion);

        credito.setDescargable(false);
        creditoService.save(credito);
        pdfService.generarUsuarioSolicitudPDF(usuarioSolicitud, usuario, credito,  pdfNombre, response);
    }
}