package com.biovizion.prestamo911.DTOs.Usuario;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

import com.biovizion.prestamo911.DTOs.Credito.CreditoDTOs;
import com.biovizion.prestamo911.DTOs.Credito.CreditoDTOs.CreditoDTO;
import com.biovizion.prestamo911.entities.UsuarioEntity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

public class UsuarioDTOs {
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UsuarioTablaDTO {
        private Long id;
        private String calificacion;
        private String usuario;

        private String dui;
        private String email;
        private String celular;
        private Boolean enabled;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UsuarioDTO {
        private Long id;
        private String calificacion;
        private String nombres;
        private String apellidos;

        private String rol;
        private String codigo;
        private String dui;
        private String direccion;
        private String email;
        private String celular;
        private String duiDelante;
        private String duiAtras;
        private Boolean enabled;

        private List<CreditoDTO> creditos;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UsuarioCuotasDTO{
        private Long id;
        private String calificacion;
        private String usuario;
        private String nombres;
        private String apellidos;
        private String celular;
        private String direccion;

        private LocalDate cuotaVencimiento;

        private BigDecimal cuotaMonto;
        private BigDecimal cuotaMora;
        private BigDecimal cuotaAbono;
        private BigDecimal cuotaTotal;

        private BigDecimal creditoMonto;
        private Integer cuotasPendientes;
        
        private BigDecimal cobrarPendiente;
        private BigDecimal totalPagar;
        private BigDecimal totalPagadas;
        
        private String referencias;
        private String referenciasCelular;
        private String parentesco;
        private String notas;
        
        private String codeudorNombre;
        private String codeudorDui;
        private String codeudorDireccion;
        
        private List<CreditoDTO> creditos;
    }

    public static UsuarioDTO mapearAUsuarioDTO(UsuarioEntity usuario){
        return new UsuarioDTO(
            usuario.getId(),
            usuario.getCalificacion(),
            usuario.getNombre(),
            usuario.getApellido(),
            usuario.getRol(),
            usuario.getCodigo(),
            usuario.getDui(),
            usuario.getDireccion(),
            usuario.getEmail(),
            usuario.getCelular(),
            usuario.getDuiDelante(),
            usuario.getDuiAtras(),
            usuario.isEnabled(),
            CreditoDTOs.mapearACreditoDTOs(usuario.getCreditos())
        );
    }

    public static UsuarioTablaDTO mapearAUsuarioTablaDTO(UsuarioEntity usuario){
        String usuarioNombre = usuario.getNombre().trim() + " " + usuario.getApellido().trim();

        return new UsuarioTablaDTO(
            usuario.getId(),
            usuario.getCalificacion(),
            usuarioNombre,
            usuario.getDui(),
            usuario.getEmail(),
            usuario.getCelular(),
            usuario.isEnabled()
        );
    }

    public static List<UsuarioTablaDTO> mapearAUsuarioTablaDTOs(List<UsuarioEntity> usuarios){
        return usuarios.stream().map(usuario -> {
            return mapearAUsuarioTablaDTO(usuario);
        }).collect(Collectors.toList());
    }
}