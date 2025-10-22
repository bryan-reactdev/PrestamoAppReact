package com.biovizion.prestamo911.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.biovizion.prestamo911.entities.HistorialSaldoEntity;

public interface HistorialSaldoRepository extends JpaRepository<HistorialSaldoEntity, Long> {
    List<HistorialSaldoEntity> findAllByTipo(String tipo);

    @Query("SELECT h FROM HistorialSaldoEntity h WHERE DATE(h.fecha) = :fecha")
    List<HistorialSaldoEntity> findAllByFecha(LocalDate fecha);

    @Query("SELECT h FROM HistorialSaldoEntity h WHERE DATE(h.fecha) = :fecha AND h.tipo = :tipo")
    List<HistorialSaldoEntity> findAllByFechaAndTipo(LocalDate fecha, String tipo);
}
