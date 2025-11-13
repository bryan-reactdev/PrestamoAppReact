package com.biovizion.prestamo911.repository;

import java.time.LocalDate;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.biovizion.prestamo911.entities.HistorialCobrosEntity;

public interface HistorialCobrosRepository extends JpaRepository<HistorialCobrosEntity, Long> {
    @Query("SELECT h FROM HistorialCobrosEntity h WHERE h.fecha = :fecha")
    Optional<HistorialCobrosEntity> findByFecha(@Param("fecha") LocalDate fecha);
}

