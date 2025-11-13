package com.biovizion.prestamo911.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.biovizion.prestamo911.entities.HistorialCobrosEntity;

public interface HistorialCobrosRepository extends JpaRepository<HistorialCobrosEntity, Long> {
    @Query("SELECT h FROM HistorialCobrosEntity h WHERE h.tipo = :tipo")
    List<HistorialCobrosEntity> findAllByTipo(@Param("tipo") String tipo);

    @Query("SELECT h FROM HistorialCobrosEntity h WHERE h.fecha = :fecha")
    List<HistorialCobrosEntity> findAllByFecha(@Param("fecha") LocalDate fecha);

    @Query("SELECT h FROM HistorialCobrosEntity h WHERE h.fecha = :fecha AND h.tipo = :tipo")
    HistorialCobrosEntity findByFechaAndTipo(@Param("fecha") LocalDate fecha, @Param("tipo") String tipo);
}

