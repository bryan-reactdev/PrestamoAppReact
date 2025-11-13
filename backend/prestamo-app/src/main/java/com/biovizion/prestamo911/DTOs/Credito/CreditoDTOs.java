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

        // nuevos atributos
        private String celular;
        private String direccion;
        private String dui;

        private BigDecimal monto;
        private BigDecimal montoDesembolsar;
        private BigDecimal mora;

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
        private String documento;
        private String nota;

        // ------------------------------------------------------
        // 🔥 INICIO: NUEVOS CAMPOS PARA LAS CANTIDADES DE CUOTAS
        // ------------------------------------------------------
        private Integer totalCuotas;
        private Integer cuotasPagadas;
        private Integer cuotasVencidas;
        private Integer cuotasPendientes;
        // ------------------------------------------------------
        // 🔥 FIN: NUEVOS CAMPOS PARA LAS CANTIDADES DE CUOTAS
        // ------------------------------------------------------
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CreditoDTO {
        private Long id;
        private Calificacion calificacion;
        private String usuario;
        private String nombres;
        private String apellidos;

        private BigDecimal monto;
        private BigDecimal montoDesembolsar;
        private BigDecimal mora;

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
        private String nota;

        @JsonManagedReference
        private List<CuotaDTO> cuotas;

        // ------------------------------------------------------
        // 🔥 NUEVOS CAMPOS PARA LAS CANTIDADES DE CUOTAS
        // ------------------------------------------------------
        private Integer totalCuotas;
        private Integer cuotasPagadas;
        private Integer cuotasVencidas;
        private Integer cuotasPendientes;
        // ------------------------------------------------------
    }

    public static CreditoTablaDTO mapearACreditoTablaDTO(CreditoEntity credito){
        String usuarioNombre = credito.getUsuario().getNombre().trim() + " " + credito.getUsuario().getApellido().trim();

        // ------------------------------------------------------
        // 🔥 INICIO: CÁLCULO DE CUOTAS para CreditoTablaDTO
        // ------------------------------------------------------
        List<CuotaDTO> cuotas = mapearACuotaDTOs(credito.getCuotas());

        int total = cuotas.size();
        int pagadas = (int) cuotas.stream().filter(c -> "Pagado".equals(c.getEstado())).count();
        int vencidas = (int) cuotas.stream().filter(c -> "Vencido".equals(c.getEstado())).count();
        int pendientes = (int) cuotas.stream().filter(c -> "Pendiente".equals(c.getEstado())).count();
        // ------------------------------------------------------
        // 🔥 FIN: CÁLCULO DE CUOTAS
        // ------------------------------------------------------

        return new CreditoTablaDTO(
            credito.getId(),
            credito.getCalificacion(),
            usuarioNombre,
            credito.getUsuario().getNombre(),
            credito.getUsuario().getApellido(),

            // nuevos atributos
            credito.getUsuario().getCelular(),
            credito.getUsuario().getDireccion(),
            credito.getUsuario().getDui(),

            credito.getMonto(),
            credito.getMontoDado(),
            credito.getMora(),
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
            credito.getTipo(),
            credito.getDocumento(),
            credito.getNota(),

            // ------------------------------------------------------
            // 🔥 INICIO: ASIGNACIÓN DE NUEVOS VALORES
            // ------------------------------------------------------
            total,
            pagadas,
            vencidas,
            pendientes
            // ------------------------------------------------------
            // 🔥 FIN: ASIGNACIÓN DE NUEVOS VALORES
            // ------------------------------------------------------
        );
    }

    public static CreditoDTO mapearACreditoDTO(CreditoEntity credito){
        String usuarioNombre = credito.getUsuario().getNombre().trim() + " " + credito.getUsuario().getApellido().trim();

        List<CuotaDTO> cuotas = mapearACuotaDTOs(credito.getCuotas());

        // ------------------------------------------------------
        // 🔥 CALCULOS DE CUOTAS
        // ------------------------------------------------------
        int total = cuotas.size();
        int pagadas = (int) cuotas.stream().filter(c -> "Pagado".equals(c.getEstado())).count();
        int vencidas = (int) cuotas.stream().filter(c -> "Vencido".equals(c.getEstado())).count();
        int pendientes = (int) cuotas.stream().filter(c -> "Pendiente".equals(c.getEstado())).count();
        // ------------------------------------------------------

        return new CreditoDTO(
            credito.getId(),
            credito.getCalificacion(),
            usuarioNombre,
            credito.getUsuario().getNombre().trim(),
            credito.getUsuario().getApellido().trim(),

            credito.getMonto(),
            credito.getMontoDado(),
            credito.getMora(),
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
            credito.getNota(),

            cuotas, 	// lista completa

            // nuevos valores calculados
            total,
            pagadas,
            vencidas,
            pendientes
        );
    }

    public static List<CreditoDTO> mapearACreditoDTOs(List<CreditoEntity> creditos) {
        return creditos.stream()
            .map(CreditoDTOs::mapearACreditoDTO)
            .collect(Collectors.toList());
    }

    public static List<CreditoTablaDTO> mapearACreditoTablaDTOs(List<CreditoEntity> creditos) {
        return creditos.stream()
            .map(CreditoDTOs::mapearACreditoTablaDTO)
            .collect(Collectors.toList());
    }
}