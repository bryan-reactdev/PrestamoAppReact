package com.biovizion.prestamo911.entities;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "credito")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreditoEntity {
    public enum Calificacion {
        A_PLUS("A+"),
        A("A"),
        B("B"),
        C("C"),
        D("D");

        private final String value;

        Calificacion(String value) {
            this.value = value;
        }

        public String getValue() {
            return value;
        }
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(precision = 10, scale = 2)
    private BigDecimal monto;

    @Column(name = "monto_dado", precision = 10, scale = 2)
    private BigDecimal montoDado;

    @Column(precision = 10, scale = 2)
    private BigDecimal abono;

    private String estado = "Pendiente";
    private String tipo;

    @Enumerated(EnumType.STRING)
    @Column(length = 10, nullable = false)
    private Calificacion calificacion = Calificacion.A_PLUS;

    @Column(name = "proximo_pago")
    private LocalDate proximoPago;

    @Column(name = "plazo_meses")
    private Integer plazoMeses;

    @Column(name = "plazo_frecuencia")
    private String plazoFrecuencia;

    @Column(name = "gastos_mensuales")
    private BigDecimal gastosMensuales;

    @Column(name = "tiene_propiedad")
    private Boolean tienePropiedad;

    @Column(name = "direccion_propiedad")
    private String direccionPropiedad;

    @Column(name = "tiene_vehiculo")
    private Boolean tieneVehiculo;

    @Column(columnDefinition = "TEXT")
    private String destino;

    @Column(name = "forma_de_pago")
    private String formaDePago;

    private String nota;

    @ManyToOne
    @JoinColumn(name = "usuario_id")
    private UsuarioEntity usuario;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "usuario_solicitud_id")
    private UsuarioSolicitudEntity usuarioSolicitud;

    // Porcentajes configurables por el admin
    @Column(name = "porcentaje_interes", precision = 5, scale = 2)
    private BigDecimal porcentajeInteres;

    @Column(name = "porcentaje_mora", precision = 5, scale = 2)
    private BigDecimal porcentajeMora;

    @Column(name = "porcentaje_iva", precision = 5, scale = 2)
    private BigDecimal porcentajeIva;

    @Column(name = "comision_fija", precision = 10, scale = 2)
    private BigDecimal comisionFija;

    // Montos automaticamente calculados
    @Column(precision = 10, scale = 2)
    private BigDecimal interes;

    @Column(precision = 10, scale = 2)
    private BigDecimal mora;

    @Column(precision = 10, scale = 2)
    private BigDecimal iva;

    @Column(precision = 10, scale = 2)
    private BigDecimal total;

    @Column(name = "cuota_mensual", precision = 10, scale = 2)
    private BigDecimal cuotaMensual;

    // Fechas de estado
    @Column(name = "fecha_aceptado", columnDefinition = "DATETIME")
    private LocalDateTime fechaAceptado;

    @Column(name = "fecha_rechazado", columnDefinition = "DATETIME")
    private LocalDateTime fechaRechazado;

    @Column(name = "fecha_refinanciado", columnDefinition = "DATETIME")
    private LocalDateTime fechaRefinanciado;

    @Column(name = "fecha_desembolsado", columnDefinition = "DATETIME")
    private LocalDateTime fechaDesembolsado;

    @Column(name = "fecha_finalizado", columnDefinition = "DATETIME")
    private LocalDateTime fechaFinalizado;

    @OneToMany(mappedBy = "credito", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<CreditoCuotaEntity> cuotas = new ArrayList<>();

    private Boolean refinanciado = false;
    private Boolean editable = false;
    private Boolean descargable = false;
    private Boolean desembolsable = false;
    private Boolean desembolsado = false;

    @Column(name = "cuota_cantidad")
    private Integer cuotaCantidad;

    @Column(name = "cuotas_vencidas")
    private Integer cuotasVencidas;

    @Column(name = "capacidad_pago")
    private String capacidadPago;
    @Column(name = "historial_crediticio")
    private String historialCrediticio;
    @Column(name = "estabilidad_laboral")
    private String estabilidadLaboral;
    @Column(name = "nivel_endeudamiento")
    private String nivelEndeudamiento;
    private String recomendacion;
}