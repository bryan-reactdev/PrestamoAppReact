package com.biovizion.prestamo911.controller;

import com.biovizion.prestamo911.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;


@Controller
@RequestMapping("")
public class HomeController {

    @Autowired
    private UsuarioService usuarioService;

    @GetMapping("/home")
    public String mostrarIndex() {
        return "home/home";
    }
    @GetMapping("/select")
    public String SelectoOption() {
        return "home/landingPage";
    }
}