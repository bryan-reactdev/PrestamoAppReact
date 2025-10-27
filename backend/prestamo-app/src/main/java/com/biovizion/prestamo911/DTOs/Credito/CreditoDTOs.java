package com.biovizion.prestamo911.DTOs.Credito;

import static com.biovizion.prestamo911.DTOs.Cuota.CuotaDTOs.mapearACuotaDTOs;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import com.biovizion.prestamo911.DTOs.Cuota.CuotaDTOs.CuotaDTO;
import com.biovizion.prestamo911.entities.CreditoEntity;
import com.biovizion.prestamo911.entities.CreditoEntity.Calificacion;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

public class CreditoDTOs {
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CreditoTablaDTO {
        private Long id;
        private Calificacion calificacion;
        private String usuario;
        private String nombres;
        private String apellidos;

        private BigDecimal monto;
        private BigDecimal montoDesembolsar;
        
        private String frecuencia;

        private LocalDateTime fechaAceptado;
        private LocalDate fechaSolicitud;
        private LocalDate fechaDesembolsado;
        private LocalDate fechaRechazado;

        private Boolean desembolsado;
        private Boolean editable;
        private Boolean descargable;
        private Boolean desembolsable;

        private String estado;
        private String tipo;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CreditoDTO{
        private Long id;
        private Calificacion calificacion;
        private String usuario;
        private String nombres;
        private String apellidos;

        private BigDecimal monto;
        private BigDecimal montoDesembolsar;
        
        private String frecuencia;

        private LocalDate fechaSolicitud;
        private LocalDate fechaAceptado;
        private LocalDate fechaDesembolsado;
        private LocalDate fechaRechazado;

        private Boolean desembolsado;
        private Boolean editable;
        private Boolean descargable;
        private Boolean desembolsable;

        private String estado;
        private String tipo;

        @JsonManagedReference  // parent → child
        private List<CuotaDTO> cuotas;
    }

    public static CreditoTablaDTO mapearACreditoTablaDTO(CreditoEntity credito){
        String usuarioNombre = credito.getUsuario().getNombre().trim() + " " + credito.getUsuario().getApellido().trim();

        return new CreditoTablaDTO(
            credito.getId(),
            credito.getCalificacion(),
            usuarioNombre,
            credito.getUsuario().getNombre(),
            credito.getUsuario().getApellido(),

            credito.getMonto(),
            credito.getMontoDado(),
            credito.getPlazoFrecuencia(),

            credito.getFechaAceptado(),
            credito.getUsuarioSolicitud().getFechaSolicitud(),
            credito.getFechaDesembolsado() != null ? credito.getFechaDesembolsado().toLocalDate() : null,
            credito.getFechaRechazado() != null ? credito.getFechaRechazado().toLocalDate() : null,

            credito.getDesembolsado(),

            credito.getEditable(),
            credito.getDescargable(),
            credito.getDesembolsable(),

            credito.getEstado(),
            credito.getTipo()
        ); 
    }

    public static CreditoDTO mapearACreditoDTO(CreditoEntity credito){
        String usuarioNombre = credito.getUsuario().getNombre().trim() + " " + credito.getUsuario().getApellido().trim();

        return new CreditoDTO(
            credito.getId(),
            credito.getCalificacion(),
            usuarioNombre,
            credito.getUsuario().getNombre().trim(),
            credito.getUsuario().getApellido().trim(),

            credito.getMonto(),
            credito.getMontoDado(),

            credito.getPlazoFrecuencia(),
            
            credito.getUsuarioSolicitud().getFechaSolicitud(),
            credito.getFechaAceptado() != null ? credito.getFechaAceptado().toLocalDate() : null,
            credito.getFechaDesembolsado() != null ? credito.getFechaDesembolsado().toLocalDate() : null,
            credito.getFechaRechazado() != null ? credito.getFechaRechazado().toLocalDate() : null,
            
            credito.getDesembolsado(),

            credito.getEditable(),
            credito.getDescargable(),
            credito.getDesembolsable(),

            credito.getEstado(),
            credito.getTipo(),
            mapearACuotaDTOs(credito.getCuotas())
        );
    }

    public static List<CreditoDTO> mapearACreditoDTOs(List<CreditoEntity> creditos) {
        return creditos.stream().map(credito -> {
            return mapearACreditoDTO(credito);
        }).collect(Collectors.toList());
    }

    public static List<CreditoTablaDTO> mapearACreditoTablaDTOs(List<CreditoEntity> creditos) {
        return creditos.stream().map(credito -> {
            return mapearACreditoTablaDTO(credito);
        }).collect(Collectors.toList());
    }
}