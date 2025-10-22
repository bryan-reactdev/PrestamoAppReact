package com.biovizion.prestamo911.DTOs.Credito;

import java.math.BigDecimal;
import java.time.LocalDate;

import lombok.Data;

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
        private String duiFrenteCodeudor;
        private String duiAtrasCodeudor;
        private String fotoRecibo;
    
        // --- Antecedentes ---
        private Boolean solicitadoAnteriormente;
        private String atrasosAnteriormente;
        private Boolean reportadoAnteriormente;
        private Boolean cobrosAnteriormente;
        private String empleo;
        private Boolean deudasActualmente;
    }
}
