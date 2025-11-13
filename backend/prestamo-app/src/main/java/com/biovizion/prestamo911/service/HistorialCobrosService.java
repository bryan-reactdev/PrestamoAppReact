package com.biovizion.prestamo911.service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import com.biovizion.prestamo911.entities.HistorialCobrosEntity;

public interface HistorialCobrosService {
    HistorialCobrosEntity save(HistorialCobrosEntity entidad);
    List<HistorialCobrosEntity> findAll();
    List<HistorialCobrosEntity> findAllByTipo(String tipo);
    List<HistorialCobrosEntity> findAllByFecha(LocalDate fecha);
    HistorialCobrosEntity findByFechaAndTipo(LocalDate fecha, String tipo);
    Optional<HistorialCobrosEntity> findById(Long id);
    void update(HistorialCobrosEntity entidad);
    void delete(Long id);
}

