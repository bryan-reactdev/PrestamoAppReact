package com.biovizion.prestamo911.service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import com.biovizion.prestamo911.entities.HistorialCobrosEntity;

public interface HistorialCobrosService {
    HistorialCobrosEntity save(HistorialCobrosEntity entidad);
    List<HistorialCobrosEntity> findAll();
    Optional<HistorialCobrosEntity> findByFecha(LocalDate fecha);
    Optional<HistorialCobrosEntity> findById(Long id);
    void update(HistorialCobrosEntity entidad);
    void delete(Long id);
}

