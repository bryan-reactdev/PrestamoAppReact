package com.biovizion.prestamo911.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.biovizion.prestamo911.entities.UsuarioAccionEntity;
import com.biovizion.prestamo911.repository.UsuarioAccionRepository;
import com.biovizion.prestamo911.service.UsuarioAccionService;
import com.biovizion.prestamo911.utils.AccionTipo;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class UsuarioAccionImpl implements UsuarioAccionService {

    @Autowired
    private UsuarioAccionRepository usuarioAccionRepository;

    @Override
    public Optional<UsuarioAccionEntity> findById(Long id) {
        return usuarioAccionRepository.findById(id);
    }

    @Override
    public List<UsuarioAccionEntity> findAll() {
        return usuarioAccionRepository.findAllByOrderByFechaDesc();
    }

    @Override
    public UsuarioAccionEntity save(UsuarioAccionEntity usuarioAccion) {
        return usuarioAccionRepository.save(usuarioAccion);
    }

    @Override
    public UsuarioAccionEntity update(UsuarioAccionEntity usuarioAccion) {
        return usuarioAccionRepository.save(usuarioAccion); // JPA save() handles both insert & update
    }

    @Override
    public void delete(Long id) {
        usuarioAccionRepository.deleteById(id);
    }

    @Override
    public List<UsuarioAccionEntity> findByAccionAndFecha(AccionTipo accion, LocalDateTime fecha) {
        return usuarioAccionRepository.findByAccionAndFecha(accion, fecha);
    }
}
