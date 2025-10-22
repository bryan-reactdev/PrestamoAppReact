package com.biovizion.prestamo911.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.biovizion.prestamo911.entities.HistorialGastoEntity;

public interface HistorialGastoRepository extends JpaRepository<HistorialGastoEntity, Long> {
	List<HistorialGastoEntity> findAllByTipo(String tipo);

	@Query("SELECT h FROM HistorialGastoEntity h WHERE DATE(h.fecha) = :fecha")
	List<HistorialGastoEntity> findAllByFecha(LocalDate fecha);

	@Query("SELECT h FROM HistorialGastoEntity h WHERE DATE(h.fecha) = :fecha AND h.tipo = :tipo")
	List<HistorialGastoEntity> findAllByFechaAndTipo(LocalDate fecha, String tipo);
}
