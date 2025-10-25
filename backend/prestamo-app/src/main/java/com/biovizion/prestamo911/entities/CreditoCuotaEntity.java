package com.biovizion.prestamo911.entities;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "credito_cuota")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreditoCuotaEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String codigo;

    @Column (name = "pago_mora")
    private BigDecimal pagoMora;

    private BigDecimal total;

    @Column(name = "fecha_vencimiento", columnDefinition = "DATE")
    private LocalDateTime fechaVencimiento;

    @Column(name = "fecha_pago", columnDefinition = "DATE")
    private LocalDateTime fechaPago;

    @Column(precision = 10, scale = 2)
    private BigDecimal monto;

    @Column(length = 30)
    private String estado;

    private BigDecimal abono;
    
    @Transient 
    private String observaciones;

    @ManyToOne
    @JoinColumn(name = "credito_id", nullable = false)
    private CreditoEntity credito;

    @OneToMany(mappedBy = "cuota", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<NotaEntity> notas = new ArrayList<>();
}