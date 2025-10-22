package com.biovizion.prestamo911.service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import com.biovizion.prestamo911.entities.HistorialGastoEntity;

public interface HistorialGastoService {
    HistorialGastoEntity save(HistorialGastoEntity entidad);
    List<HistorialGastoEntity> findAll();
    List<HistorialGastoEntity> findAllByTipo(String tipo);
    List<HistorialGastoEntity> findAllByFecha(LocalDate fecha);
    List<HistorialGastoEntity> findAllByFechaAndTipo(LocalDate fecha, String tipo);
    Optional<HistorialGastoEntity> findById(Long id);
    void update(HistorialGastoEntity entidad);
    void delete(Long id);
}
