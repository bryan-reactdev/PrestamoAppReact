package com.biovizion.prestamo911.entities;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "usuario_solicitud")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UsuarioSolicitudEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nombres;
    private String apellidos;

    @Column(name = "dui_delante")
    private String duiDelante;

    @Column(name = "dui_atras")
    private String duiAtras;

    private String dui;

    private String nit;

    @Column(name = "fecha_nacimiento")
    private LocalDate fechaNacimiento;

    @Column(name = "estado_civil")
    private String estadoCivil;

    private String telefono;
    private String email;
    private String direccion;

    @Column(name = "empresa_trabajo")
    private String empresaTrabajo;

    private String puesto;

    @Column(name = "ingreso_mensual")
    private Double ingresoMensual;

    @Column(name = "tipo_contrato")
    private String tipoContrato;

    @Column(name = "referencia1_nombre")
    private String referencia1;

    @Column(name = "telefono_referencia1")
    private String telefonoReferencia1;

    private String parentesco1;

    @Column(name = "referencia2_nombre")
    private String referencia2;

    @Column(name = "telefono_referencia2")
    private String telefonoReferencia2;

    private String parentesco2;

    private String firma;

    @Column(name = "fecha_solicitud")
    private LocalDate fechaSolicitud;

    @Column(name = "codeudor_nombre")
    private String codeudorNombre;

    @Column(name = "codeudor_dui")
    private String codeudorDui;

    @Column(name = "dui_delante_codeudor")
    private String duiDelanteCodeudor;

    @Column(name = "dui_atras_codeudor")
    private String duiAtrasCodeudor;

    @Column(name = "foto_recibo")
    private String fotoRecibo;

    @Column(name = "codeudor_direccion")
    private String codeudorDireccion;

    @Column(name = "ingreso_mensual_codeudor")
    private BigDecimal ingresoMensualCodeudor;

    @Column(name = "frecuencia_pago_credito_anterior")
    private String frecuenciaPagoCreditoAnterior;

    // --- Campos Empleado ---

    @Column(name = "direccion_empresa")
    private String direccionEmpresa;

    @Column(name = "telefono_empresa")
    private String telefonoEmpresa;

    @Column(name = "antiguedad_laboral")
    private String antiguedadLaboral;

    @Column(name = "ingreso_mensual_empleado")
    private BigDecimal ingresoMensualEmpleado;

    // --- Campos Emprendedor ---
    @Column(name = "actividad_emprendedor")
    private String actividadEmprendedor;

    @Column(name = "ingreso_mensual_emprendedor")
    private BigDecimal ingresoMensualEmprendedor;

    @Column(name = "otros_ingresos")
    private String otrosIngresos;

    @Column(name = "telefono_negocio")
    private String telefonoNegocio;

    @Column(name = "direccion_negocio")
    private String direccionNegocio;

    @Column(name = "antiguedad_negocio")
    private String antiguedadNegocio;

    @Column(name = "representante_legal")
    private String representanteLegal;

    private Boolean solicitado;

    @Column(name = "solicitado_entidad")
    private String solicitadoEntidad;

    @Column(name = "solicitado_monto")
    private Double solicitadoMonto;

    @Enumerated(EnumType.STRING)
    @Column(name = "solicitado_estado")
    private SolicitadoEstado solicitadoEstado;

    @Enumerated(EnumType.STRING)
    private Atrasos atrasos;

    private Boolean reportado;
    private Boolean deudas;

    @Enumerated(EnumType.STRING)
    private Empleado empleado;

    @Column(name = "otras_deudas")
    private Boolean otrasDeudas;

    @Column(name = "otras_deudas_entidad")
    private String otrasDeudasEntidad;
    
    @Column(name = "otras_deudas_monto")
    private Double otrasDeudasMonto;

    public enum SolicitadoEstado {
        pagado,
        en_curso,
        incumplido
    }

    public enum Atrasos {
        nunca,
        uno_a_dos,
        dos_o_mas
    }

    public enum Empleado {
        empleo_fijo,
        negocio_propio,
        ninguno
    }
}