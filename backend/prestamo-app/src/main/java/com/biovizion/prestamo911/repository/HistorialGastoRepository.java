package com.biovizion.prestamo911.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.biovizion.prestamo911.entities.HistorialGastoEntity;

public interface HistorialGastoRepository extends JpaRepository<HistorialGastoEntity, Long> {
	@Query("SELECT DISTINCT h FROM HistorialGastoEntity h LEFT JOIN FETCH h.imagenes WHERE h.tipo = :tipo")
	List<HistorialGastoEntity> findAllByTipo(String tipo);

	@Query("SELECT DISTINCT h FROM HistorialGastoEntity h LEFT JOIN FETCH h.imagenes WHERE DATE(h.fecha) = :fecha")
	List<HistorialGastoEntity> findAllByFecha(LocalDate fecha);

	@Query("SELECT DISTINCT h FROM HistorialGastoEntity h LEFT JOIN FETCH h.imagenes WHERE DATE(h.fecha) = :fecha AND h.tipo = :tipo")
	List<HistorialGastoEntity> findAllByFechaAndTipo(LocalDate fecha, String tipo);
}
