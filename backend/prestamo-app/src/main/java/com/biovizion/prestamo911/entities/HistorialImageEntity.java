package com.biovizion.prestamo911.entities;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "historial_image")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class HistorialImageEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "file_path", columnDefinition = "TEXT")
    private String filePath;

    @Column(name = "file_name")
    private String fileName;

    @Column(name = "file_size")
    private Long fileSize;

    @Column(name = "mime_type")
    private String mimeType;

    @Column(columnDefinition = "DATETIME")
    private LocalDateTime fecha;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "historial_saldo_id", nullable = true)
    private HistorialSaldoEntity historialSaldo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "historial_gasto_id", nullable = true)
    private HistorialGastoEntity historialGasto;
}

