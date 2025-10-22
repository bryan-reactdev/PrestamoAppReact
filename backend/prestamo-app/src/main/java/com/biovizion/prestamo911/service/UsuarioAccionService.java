package com.biovizion.prestamo911.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import com.biovizion.prestamo911.entities.UsuarioAccionEntity;
import com.biovizion.prestamo911.utils.AccionTipo;

public interface UsuarioAccionService {
    Optional<UsuarioAccionEntity> findById(Long id);
    List<UsuarioAccionEntity> findAll();
    List<UsuarioAccionEntity> findByAccionAndFecha(AccionTipo accion, LocalDateTime fecha);
    UsuarioAccionEntity save(UsuarioAccionEntity usuarioAccion);
    UsuarioAccionEntity update(UsuarioAccionEntity usuarioAccion);
    void delete(Long id);
}
