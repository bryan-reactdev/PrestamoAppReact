package com.biovizion.prestamo911.entities;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "usuario")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UsuarioEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nombre;

    private String apellido;

    private String codigo;

    @Column(unique = true)
    private String email;

    private String password;

    private String celular;

    private String direccion;

    private String rol;

    @Column(name = "codigo_verificacion")
    private String codigoVerificacion;

    @Column(name = "activo")
    private boolean activo;

    private String foto;
    
    private String dui;
    private String nit;
    private String ocupacion;
    
    @Column(name = "dui_delante")
    private String duiDelante;
    
    @Column(name = "dui_atras")
    private String duiAtras;

    @Column(name = "fuente_conocimiento")
    private String fuenteConocimiento;       // Cómo conoció Multipréstamos ATLAS

    @Column(name = "conoce_alguien")
    private Boolean conoceAlguien;           // Conoce a alguien con crédito en Multipréstamos ATLAS

    @Column(name = "perfil_red_social")
    private String perfilRedSocial;          // Link a perfil de Facebook u otra red

    @Column(name = "tiempo_residencia")
    private String tiempoResidencia;         // Tiempo de residencia en la dirección actual (años/meses)

    @Column(name = "estado_civil")
    private String estadoCivil;

    @Column(name = "fecha_nacimiento")
    private LocalDate fechaNacimiento;

    @Column(name = "gastos_mensuales")
    private BigDecimal gastosMensuales;      // Gastos mensuales aproximados (vivienda, alimentación, transporte)

    @Column(name = "nombre_persona_conocida")
    private String nombrePersonaConocida;   // Nombre de la persona que conoce con crédito

    @Column(name = "telefono_persona_conocida")
    private String telefonoPersonaConocida; // Teléfono de la persona que conoce con crédito

    @Column(nullable = false)
    private boolean enabled = true;
    
    private String calificacion = "A_PLUS"; 
    
    @OneToMany(mappedBy = "usuario", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<CreditoEntity> creditos = new ArrayList<>();

    @OneToMany(mappedBy = "usuario")
    @JsonIgnore
    private List<UsuarioAccionEntity> accionesRealizadas = new ArrayList<>();
    
    @OneToMany(mappedBy = "usuarioAfectado")
    @JsonIgnore
    private List<UsuarioAccionEntity> accionesRecibidas = new ArrayList<>();

    @Override
    public String toString() {
        return "UsuarioEntity{" +
            "id=" + id +
            ", nombre='" + nombre + '\'' +
            ", apellido='" + apellido + '\'' +
            '}';
    }
}
