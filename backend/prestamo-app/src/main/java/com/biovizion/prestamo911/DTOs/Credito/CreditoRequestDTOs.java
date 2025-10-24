package com.biovizion.prestamo911.DTOs.Credito;

import java.math.BigDecimal;
import java.time.LocalDate;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.multipart.MultipartFile;

import com.biovizion.prestamo911.entities.CreditoEntity;
import com.biovizion.prestamo911.entities.UsuarioEntity;
import com.biovizion.prestamo911.entities.UsuarioSolicitudEntity;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.biovizion.prestamo911.entities.CreditoEntity.Calificacion;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

public class CreditoRequestDTOs{
    @Data
    public static class CreditoDesembolsarRequest {
        private boolean desembolsar;

        private LocalDate fechaDesembolso;
        private LocalDate fechaPrimeraComision;
    }

    @Data
    public static class CreditoEditableRequest {
        private boolean editable;
    }

    @Data
    public static class CreditoDescargableRequest {
        private boolean descargable;
    }
    

    @Data
    public static class CreditoDesembolsableRequest {
        private boolean desembolsable;
    }
    
    @Data
    public static class CreditoAceptarRequest {
        private BigDecimal montoAprobado;
        private BigDecimal cuotaMensual;
        private BigDecimal mora;
        private String frecuencia;
        private int cuotaCantidad;
    }
    
    @Data
    public static class CreditoSolicitudRequest {
        private Long usuarioId;
        
        // --- Sección 1 ---
        private BigDecimal monto;
        private String frecuenciaPago;
        private String finalidadCredito;
        private String formaPago;
        private Boolean propiedadANombre;
        private Boolean vehiculoANombre;
    
        // --- Info personal ---
        private String dui;
        private String nombres;
        private String apellidos;
        private String email;
        private String celular;
        private String direccion;
        private String tiempoResidencia;
        private String estadoCivil;
        private LocalDate fechaNacimiento;
        private BigDecimal gastosMensuales;
        private String comoConocio;
        private Boolean conoceAlguien;
        private String enlaceRedSocial;
    
        // --- Info laboral ---
        private String ocupacion;
    
        // --- Referencias ---
        private String nombreReferencia1;
        private String celularReferencia1;
        private String parentescoReferencia1;
        private String nombreReferencia2;
        private String celularReferencia2;
        private String parentescoReferencia2;
    
        // --- Co-deudor ---
        private String nombreCodeudor;
        private String duiCodeudor;
        private String direccionCodeudor;
        private BigDecimal ingresosMensualesCodeudor;
        
        private MultipartFile duiDelanteCodeudor;
        private MultipartFile duiAtrasCodeudor;
        private MultipartFile fotoRecibo;
    
        // --- Antecedentes ---
        private Boolean solicitadoAnteriormente;
        private String atrasosAnteriormente;
        private Boolean reportadoAnteriormente;
        private Boolean cobrosAnteriormente;
        private String empleo;
        private Boolean deudasActualmente;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class CreditoFullDTO {
        private Long id;
        private Calificacion calificacion;

        private BigDecimal montoDesembolsar;
        
        private LocalDate fechaSolicitud;
        @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
        @JsonFormat(pattern = "yyyy-MM-dd")
        private LocalDate fechaAceptado;

        private LocalDate fechaDesembolsado;
        private LocalDate fechaRechazado;

        private Boolean desembolsado;
        private Boolean editable;
        private Boolean descargable;
        private Boolean desembolsable;

        private String estado;
        
        // --- Sección 1 ---
        private BigDecimal monto;
        private String frecuenciaPago;
        private String finalidadCredito;
        private String formaPago;
        private Boolean propiedadANombre;
        private Boolean vehiculoANombre;
    
        // --- Info personal ---
        private String dui;
        private String nombres;
        private String apellidos;
        private String email;
        private String celular;
        private String direccion;
        private String tiempoResidencia;
        private String estadoCivil;
        private LocalDate fechaNacimiento;
        private BigDecimal gastosMensuales;
        private String comoConocio;
        private Boolean conoceAlguien;
        private String enlaceRedSocial;
    
        // --- Info laboral ---
        private String ocupacion;
    
        // --- Referencias ---
        private String nombreReferencia1;
        private String celularReferencia1;
        private String parentescoReferencia1;
        private String nombreReferencia2;
        private String celularReferencia2;
        private String parentescoReferencia2;
    
        // --- Co-deudor ---
        private String nombreCodeudor;
        private String duiCodeudor;
        private String direccionCodeudor;
        private BigDecimal ingresosMensualesCodeudor;
        
        private MultipartFile duiDelanteCodeudor;
        private MultipartFile duiAtrasCodeudor;
        private MultipartFile fotoRecibo;
        private String duiDelanteCodeudorPreview;
        private String duiAtrasCodeudorPreview;
        private String fotoReciboPreview;
    
        // --- Antecedentes ---
        private Boolean solicitadoAnteriormente;
        private String atrasosAnteriormente;
        private Boolean reportadoAnteriormente;
        private Boolean cobrosAnteriormente;
        private String empleo;
        private Boolean deudasActualmente;
    }

    public static CreditoFullDTO mapearACreditoEditDTO(CreditoEntity credito) {
        UsuarioEntity usuario = credito.getUsuario();
        UsuarioSolicitudEntity solicitud = credito.getUsuarioSolicitud();

        return CreditoFullDTO.builder()
            .id(credito.getId())
            .calificacion(credito.getCalificacion())
            .montoDesembolsar(credito.getMontoDado())
            .fechaSolicitud(solicitud.getFechaSolicitud())
            .fechaAceptado(credito.getFechaAceptado() != null ? credito.getFechaAceptado().toLocalDate() : null)
            .fechaDesembolsado(credito.getFechaDesembolsado() != null ? credito.getFechaDesembolsado().toLocalDate() : null)
            .fechaRechazado(credito.getFechaRechazado() != null ? credito.getFechaRechazado().toLocalDate() : null)
            .desembolsado(credito.getDesembolsado())
            .editable(credito.getEditable())
            .descargable(credito.getDescargable())
            .desembolsable(credito.getDesembolsable())
            .estado(credito.getEstado())
            // --- Sección 1 ---
            .monto(credito.getMonto())
            .frecuenciaPago(credito.getPlazoFrecuencia())
            .finalidadCredito(credito.getDestino())
            .formaPago(credito.getFormaDePago())
            .propiedadANombre(credito.getTienePropiedad())
            .vehiculoANombre(credito.getTieneVehiculo())
            // --- Info personal ---
            .dui(usuario.getDui())
            .nombres(usuario.getNombre())
            .apellidos(usuario.getApellido())
            .email(usuario.getEmail())
            .celular(usuario.getCelular())
            .direccion(usuario.getDireccion())
            .tiempoResidencia(usuario.getTiempoResidencia())
            .estadoCivil(usuario.getEstadoCivil())
            .fechaNacimiento(usuario.getFechaNacimiento())
            .gastosMensuales(usuario.getGastosMensuales())
            .comoConocio(usuario.getFuenteConocimiento())
            .conoceAlguien(usuario.getConoceAlguien())
            .enlaceRedSocial(usuario.getPerfilRedSocial())
            // --- Info laboral ---
            .ocupacion(usuario.getOcupacion())
            // --- Referencias ---
            .nombreReferencia1(solicitud.getReferencia1())
            .celularReferencia1(solicitud.getTelefonoReferencia1())
            .parentescoReferencia1(solicitud.getParentesco1())
            .nombreReferencia2(solicitud.getReferencia2())
            .celularReferencia2(solicitud.getTelefonoReferencia2())
            .parentescoReferencia2(solicitud.getParentesco2())
            // --- Co-deudor ---
            .nombreCodeudor(solicitud.getCodeudorNombre())
            .duiCodeudor(solicitud.getCodeudorDui())
            .direccionCodeudor(solicitud.getCodeudorDireccion())
            .ingresosMensualesCodeudor(solicitud.getIngresoMensualCodeudor())
            .duiDelanteCodeudor(null) // no file yet
            .duiAtrasCodeudor(null)
            .fotoRecibo(null)
            .duiDelanteCodeudorPreview(solicitud.getDuiDelanteCodeudor())
            .duiAtrasCodeudorPreview(solicitud.getDuiAtrasCodeudor())
            .fotoReciboPreview(solicitud.getFotoRecibo())
            // --- Antecedentes ---
            .solicitadoAnteriormente(solicitud.getSolicitado())
            .atrasosAnteriormente(solicitud.getAtrasos())
            .reportadoAnteriormente(solicitud.getReportado())
            .cobrosAnteriormente(solicitud.getDeudas())
            .empleo(solicitud.getEmpleado())
            .deudasActualmente(solicitud.getOtrasDeudas())
            .build();
    }
}