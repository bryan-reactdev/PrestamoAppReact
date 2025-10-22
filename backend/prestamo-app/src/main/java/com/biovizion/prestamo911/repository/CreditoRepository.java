package com.biovizion.prestamo911.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.biovizion.prestamo911.entities.CreditoEntity;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface CreditoRepository extends JpaRepository<CreditoEntity, Long> {
    @Query("SELECT c FROM CreditoEntity c WHERE c.desembolsado = :desembolsado AND DATE(c.fechaDesembolsado) = :fecha")
    List<CreditoEntity> findAllByDesembolsadoAndFechaDesembolsado(@Param("desembolsado") Boolean desembolsado, @Param("fecha") LocalDate fecha);

    @Query("SELECT c FROM CreditoEntity c WHERE LOWER(c.estado) = :estado AND DATE(c.fechaAceptado) = :fecha")
    List<CreditoEntity> findAllByEstadoAndFechaAceptado(@Param("estado") String estado, @Param("fecha") LocalDate fecha);

    List<CreditoEntity> findAllByDesembolsado(Boolean desembolsado);

    @Query("SELECT c FROM CreditoEntity c WHERE LOWER(c.estado) = 'pendiente' ORDER BY c.usuarioSolicitud.fechaSolicitud DESC")
    List<CreditoEntity> findPendientes();

    @Query("SELECT c FROM CreditoEntity c WHERE LOWER(c.estado) = 'aceptado' ORDER BY c.fechaAceptado DESC")
    List<CreditoEntity> findAceptados();

    @Query("SELECT c FROM CreditoEntity c WHERE LOWER(c.estado) = 'rechazado' ORDER BY c.usuarioSolicitud.fechaSolicitud DESC")
    List<CreditoEntity> findRechazados();

    @Query("SELECT c FROM CreditoEntity c WHERE LOWER(c.estado) = 'finalizado' ORDER BY c.fechaAceptado DESC")
    List<CreditoEntity> findFinalizados();

    @Query("SELECT c FROM CreditoEntity c WHERE c.usuario.id = :id ORDER BY c.usuarioSolicitud.fechaSolicitud DESC")
    List<CreditoEntity> findByUsuarioId(Long id);

    @Query("SELECT c FROM CreditoEntity c WHERE LOWER(c.estado) = 'pendiente' AND c.usuario.id = :id ORDER BY c.usuarioSolicitud.fechaSolicitud DESC")
    List<CreditoEntity> findPendientesByUsuarioId(Long id);

    @Query("SELECT c FROM CreditoEntity c WHERE LOWER(c.estado) = 'aceptado' AND c.usuario.id = :id ORDER BY c.usuarioSolicitud.fechaSolicitud DESC")
    List<CreditoEntity> findAceptadosByUsuarioId(Long id);

    @Query("SELECT c FROM CreditoEntity c WHERE LOWER(c.estado) = 'rechazado' AND c.usuario.id = :id ORDER BY c.usuarioSolicitud.fechaSolicitud DESC")
    List<CreditoEntity> findRechazadosByUsuarioId(Long id);

    @Query("SELECT c FROM CreditoEntity c WHERE LOWER(c.estado) = 'finalizado' AND c.usuario.id = :id ORDER BY c.usuarioSolicitud.fechaSolicitud DESC")
    List<CreditoEntity> findFinalizadosByUsuarioId(Long id);
}
