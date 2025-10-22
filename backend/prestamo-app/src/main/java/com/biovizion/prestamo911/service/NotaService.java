package com.biovizion.prestamo911.service;

import java.util.List;
import java.util.Optional;

import com.biovizion.prestamo911.entities.NotaEntity;

public interface NotaService {
    NotaEntity save(NotaEntity nota);
    List<NotaEntity> findAll();
    Optional<NotaEntity> findById(Long id);
    public void update(NotaEntity nota);
    public void delete(Long id);
}
