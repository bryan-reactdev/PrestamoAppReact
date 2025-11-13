package com.biovizion.prestamo911.DTOs.Credito;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.lang.Nullable;

import com.biovizion.prestamo911.DTOs.Cuota.CuotaDTOs.CuotaDTO;
import com.biovizion.prestamo911.entities.CreditoEntity;
import com.biovizion.prestamo911.entities.UsuarioEntity;
import com.biovizion.prestamo911.entities.UsuarioSolicitudEntity;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
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
    public static class CreditoNotaRequest {
        private String nota;
    }
    
    @Data
    public static class CreditoAceptarRequest {
        private static final ObjectMapper objectMapper = new ObjectMapper();
        
        private BigDecimal montoAprobado;
        private BigDecimal cuotaMensual;
        private BigDecimal mora;
        private String frecuencia;
        private int cuotaCantidad;
        private String nota;

        private Long selectedCreditoId;
        private List<CuotaDTO> selectedCuotas;
        
        @Nullable
        private MultipartFile document;
        
        // Custom setter to handle selectedCuotas as JSON string from FormData
        @SuppressWarnings("unchecked")
        public void setSelectedCuotas(Object selectedCuotas) {
            if (selectedCuotas == null) {
                this.selectedCuotas = null;
                return;
            }
            
            if (selectedCuotas instanceof List) {
                this.selectedCuotas = (List<CuotaDTO>) selectedCuotas;
            } else if (selectedCuotas instanceof String) {
                try {
                    String jsonString = (String) selectedCuotas;
                    this.selectedCuotas = objectMapper.readValue(jsonString, new TypeReference<List<CuotaDTO>>() {});
                } catch (Exception e) {
                    this.selectedCuotas = null;
                }
            } else {
                this.selectedCuotas = null;
            }
        }
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
        @Nullable
        private String direccionPropiedad;
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
        @Nullable
        private String nombrePersonaConocida;
        @Nullable
        private String telefonoPersonaConocida;
        private String enlaceRedSocial;
    
        // --- Info laboral ---
        private String ocupacion;
        // --- Campos Empleado ---
        @Nullable
        private String empresaTrabajo;
        @Nullable
        private String direccionEmpresa;
        @Nullable
        private String telefonoEmpresa;
        @Nullable
        private String antiguedadLaboral;
        @Nullable
        private BigDecimal ingresoMensualEmpleado;
        // --- Campos Emprendedor ---
        @Nullable
        private String actividadEmprendedor;
        @Nullable
        private BigDecimal ingresoMensualEmprendedor;
        @Nullable
        private String otrosIngresos;
        @Nullable
        private String telefonoNegocio;
        @Nullable
        private String direccionNegocio;
        @Nullable
        private String antiguedadNegocio;
    
        // --- Referencias ---
        @Nullable
        private String nombreReferencia1;
        @Nullable
        private String celularReferencia1;
        @Nullable
        private String parentescoReferencia1;
        @Nullable
        private String nombreReferencia2;
        @Nullable
        private String celularReferencia2;
        @Nullable
        private String parentescoReferencia2;
    
        // --- Co-deudor ---
        @Nullable
        private String nombreCodeudor;
        @Nullable
        private String duiCodeudor;
        @Nullable
        private String direccionCodeudor;
        @Nullable
        private BigDecimal ingresosMensualesCodeudor;
        
        @Nullable
        private MultipartFile duiDelanteCodeudor;
        @Nullable
        private MultipartFile duiAtrasCodeudor;
        @Nullable
        private MultipartFile fotoRecibo;
        
        @Nullable
        private String duiDelanteCodeudorPreview;
        @Nullable
        private String duiAtrasCodeudorPreview;
        @Nullable
        private String fotoReciboPreview;
    
        // --- Antecedentes ---
        private Boolean solicitadoAnteriormente;
        @Nullable
        private String solicitadoEntidad;
        @Nullable
        private String frecuenciaPagoCreditoAnterior;
        @Nullable
        private Double solicitadoMonto;
        @Nullable
        private String solicitadoEstado;
        private String atrasosAnteriormente;
        private Boolean reportadoAnteriormente;
        private Boolean cobrosAnteriormente;
        private String empleo;
        private Boolean deudasActualmente;
        @Nullable
        private String otrasDeudasEntidad;
        @Nullable
        private Double otrasDeudasMonto;
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
        @Nullable
        private String direccionPropiedad;
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
        @Nullable
        private String nombrePersonaConocida;
        @Nullable
        private String telefonoPersonaConocida;
        private String enlaceRedSocial;
    
        // --- Info laboral ---
        private String ocupacion;
        // --- Campos Empleado ---
        @Nullable
        private String empresaTrabajo;
        @Nullable
        private String direccionEmpresa;
        @Nullable
        private String telefonoEmpresa;
        @Nullable
        private String antiguedadLaboral;
        @Nullable
        private BigDecimal ingresoMensualEmpleado;
        // --- Campos Emprendedor ---
        @Nullable
        private String actividadEmprendedor;
        @Nullable
        private BigDecimal ingresoMensualEmprendedor;
        @Nullable
        private String otrosIngresos;
        @Nullable
        private String telefonoNegocio;
        @Nullable
        private String direccionNegocio;
        @Nullable
        private String antiguedadNegocio;
    
        // --- Referencias ---
        @Nullable
        private String nombreReferencia1;
        @Nullable
        private String celularReferencia1;
        @Nullable
        private String parentescoReferencia1;
        @Nullable
        private String nombreReferencia2;
        @Nullable
        private String celularReferencia2;
        @Nullable
        private String parentescoReferencia2;
    
        // --- Co-deudor ---
        @Nullable
        private String nombreCodeudor;
        @Nullable
        private String duiCodeudor;
        @Nullable
        private String direccionCodeudor;
        @Nullable
        private BigDecimal ingresosMensualesCodeudor;
        
        @Nullable
        private MultipartFile duiDelanteCodeudor;
        @Nullable
        private MultipartFile duiAtrasCodeudor;
        @Nullable
        private MultipartFile fotoRecibo;
        private String duiDelanteCodeudorPreview;
        private String duiAtrasCodeudorPreview;
        private String fotoReciboPreview;
    
        // --- Antecedentes ---
        private Boolean solicitadoAnteriormente;
        @Nullable
        private String solicitadoEntidad;
        @Nullable
        private String frecuenciaPagoCreditoAnterior;
        @Nullable
        private Double solicitadoMonto;
        @Nullable
        private String solicitadoEstado;
        private String atrasosAnteriormente;
        private Boolean reportadoAnteriormente;
        private Boolean cobrosAnteriormente;
        private String empleo;
        private Boolean deudasActualmente;
        @Nullable
        private String otrasDeudasEntidad;
        @Nullable
        private Double otrasDeudasMonto;
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
            .direccionPropiedad(credito.getDireccionPropiedad())
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
            .nombrePersonaConocida(usuario.getNombrePersonaConocida())
            .telefonoPersonaConocida(usuario.getTelefonoPersonaConocida())
            .enlaceRedSocial(usuario.getPerfilRedSocial())
            // --- Info laboral ---
            .ocupacion(usuario.getOcupacion())
            // --- Campos Empleado ---
            .empresaTrabajo(solicitud.getEmpresaTrabajo())
            .direccionEmpresa(solicitud.getDireccionEmpresa())
            .telefonoEmpresa(solicitud.getTelefonoEmpresa())
            .antiguedadLaboral(solicitud.getAntiguedadLaboral())
            .ingresoMensualEmpleado(solicitud.getIngresoMensualEmpleado())
            // --- Campos Emprendedor ---
            .actividadEmprendedor(solicitud.getActividadEmprendedor())
            .ingresoMensualEmprendedor(solicitud.getIngresoMensualEmprendedor())
            .otrosIngresos(solicitud.getOtrosIngresos())
            .telefonoNegocio(solicitud.getTelefonoNegocio())
            .direccionNegocio(solicitud.getDireccionNegocio())
            .antiguedadNegocio(solicitud.getAntiguedadNegocio())
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
            .solicitadoEntidad(solicitud.getSolicitadoEntidad())
            .frecuenciaPagoCreditoAnterior(solicitud.getFrecuenciaPagoCreditoAnterior())
            .solicitadoMonto(solicitud.getSolicitadoMonto())
            .solicitadoEstado(solicitud.getSolicitadoEstado())
            .atrasosAnteriormente(solicitud.getAtrasos())
            .reportadoAnteriormente(solicitud.getReportado())
            .cobrosAnteriormente(solicitud.getDeudas())
            .empleo(solicitud.getEmpleado())
            .deudasActualmente(solicitud.getOtrasDeudas())
            .otrasDeudasEntidad(solicitud.getOtrasDeudasEntidad())
            .otrasDeudasMonto(solicitud.getOtrasDeudasMonto())
            .build();
    }
}