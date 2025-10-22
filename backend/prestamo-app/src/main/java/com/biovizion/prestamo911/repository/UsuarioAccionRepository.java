package com.biovizion.prestamo911.repository;

import com.biovizion.prestamo911.entities.UsuarioAccionEntity;
import com.biovizion.prestamo911.utils.AccionTipo;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface UsuarioAccionRepository extends JpaRepository<UsuarioAccionEntity, Long> {
    List<UsuarioAccionEntity> findAllByOrderByFechaDesc();
    List<UsuarioAccionEntity> findByAccionAndFecha(AccionTipo accion, LocalDateTime fecha);
}