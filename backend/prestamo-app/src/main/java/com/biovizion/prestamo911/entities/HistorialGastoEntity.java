package com.biovizion.prestamo911.entities;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "historial_gastos")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class HistorialGastoEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(precision = 10, scale = 2)
    private BigDecimal monto;

    @Column(columnDefinition = "TEXT")
    private String motivo;

    @Column
    private String tipo;

    @Column(columnDefinition = "DATETIME")
    private LocalDateTime fecha;
}
