package com.biovizion.prestamo911.DTOs.Usuario;

import org.springframework.web.multipart.MultipartFile;

import lombok.Data;

public class UsuarioRequestDTOs {
    @Data
    public static class UsuarioEditRequest{
        private Long usuarioId;
        private String nombres;
        private String apellidos;
        private String email;
        private String celular;
        private String direccion;
        private MultipartFile duiDelante;
        private MultipartFile duiAtras;
        private String password;
    }
}