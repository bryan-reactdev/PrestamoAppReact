package com.biovizion.prestamo911.repository;

import java.time.LocalDate;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.biovizion.prestamo911.entities.HistorialBalanceEntity;

public interface HistorialBalanceRepository extends JpaRepository<HistorialBalanceEntity, Long> {
    @Query("SELECT h FROM HistorialBalanceEntity h WHERE DATE(h.fecha) = :fecha")
    HistorialBalanceEntity findByFecha(@Param("fecha") LocalDate fecha);
}
