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

    // Pendientes
    @Column
    private Integer cantidadPendientes;

    @Column(precision = 10, scale = 2)
    private BigDecimal montoPendientes;

    @Column
    private Integer usuariosPendientes;

    // Vencidas
    @Column
    private Integer cantidadVencidas;

    @Column(precision = 10, scale = 2)
    private BigDecimal montoVencidas;

    @Column
    private Integer usuariosVencidas;

    // Pagadas
    @Column
    private Integer cantidadPagadas;

    @Column(precision = 10, scale = 2)
    private BigDecimal montoPagadas;

    @Column
    private Integer usuariosPagadas;

    @Column(columnDefinition = "DATE")
    private LocalDate fecha;
}

