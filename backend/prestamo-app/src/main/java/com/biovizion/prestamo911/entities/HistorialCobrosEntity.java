package com.biovizion.prestamo911.entities;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "historial_cobros")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class HistorialCobrosEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column
    private String tipo; // Pendientes, Vencidas, Pagadas

    @Column
    private Integer cantidad; // Number of cuotas

    @Column(precision = 10, scale = 2)
    private BigDecimal monto; // Total amount

    @Column
    private Integer usuarios; // Number of unique users

    @Column(columnDefinition = "DATE")
    private LocalDate fecha;
}

