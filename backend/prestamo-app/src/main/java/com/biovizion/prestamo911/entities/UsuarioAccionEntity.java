package com.biovizion.prestamo911.entities;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

import com.biovizion.prestamo911.utils.AccionTipo;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "usuario_accion")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UsuarioAccionEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AccionTipo accion;

    @Column(nullable = false, updatable = false)
    private LocalDateTime fecha = LocalDateTime.now();

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "usuario_id", nullable = false)
    @JsonIgnore
    private UsuarioEntity usuario;
    
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "usuario_afectado_id", nullable = false)
    @JsonIgnore
    private UsuarioEntity usuarioAfectado;
}
