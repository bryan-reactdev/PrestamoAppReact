package com.biovizion.prestamo911.entities;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "historial_balance")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class HistorialBalanceEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(precision = 10, scale = 2)
    private BigDecimal monto;

    @Column(name = "ingresos_totales", precision = 10, scale = 2)
    private BigDecimal ingresosTotales;

    @Column(name = "egresos_totales", precision = 10, scale = 2)
    private BigDecimal egresosTotales;

    @Column(columnDefinition = "DATETIME")
    private LocalDate fecha;
}
