package com.biovizion.prestamo911.entities;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "abono_cuota")
public class AbonoCuotaEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "fecha_abono", nullable = false)
    private LocalDate fechaAbono;
    private BigDecimal monto;

    @ManyToOne
    @JoinColumn(name = "credito_cuota_id", nullable = false)
    private CreditoCuotaEntity creditoCuota;
}