package com.biovizion.prestamo911.service;

import java.util.List;
import java.util.Optional;

import com.biovizion.prestamo911.entities.MensajeEntity;

public interface MensajeService {
    List<MensajeEntity> findAll();
    MensajeEntity save(MensajeEntity mensaje);
    Optional<MensajeEntity> findById(Long id);
    List<MensajeEntity> findByLeido(Boolean leido);
    public void update(MensajeEntity mensaje);
    public void delete(Long id);
}

