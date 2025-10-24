package com.biovizion.prestamo911.entities;

import java.time.LocalDateTime;

import com.biovizion.prestamo911.DTOs.Cuota.CuotaDTOs.CuotaDTO;
import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "notas")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class NotaEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String contenido;

    private LocalDateTime fecha;

    @ManyToOne(fetch = FetchType.LAZY) // or EAGER if you prefer
    @JoinColumn(name = "cuota_id", nullable = false)
    @JsonBackReference  // child → parent
    private CreditoCuotaEntity cuota;
}