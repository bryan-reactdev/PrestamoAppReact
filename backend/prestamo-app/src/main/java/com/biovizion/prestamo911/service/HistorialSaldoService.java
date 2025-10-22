package com.biovizion.prestamo911.service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import com.biovizion.prestamo911.entities.HistorialSaldoEntity;

public interface HistorialSaldoService {
    HistorialSaldoEntity save(HistorialSaldoEntity entidad);
    List<HistorialSaldoEntity> findAll();
    List<HistorialSaldoEntity> findAllByTipo(String tipo);
    List<HistorialSaldoEntity> findAllByFecha(LocalDate fecha);
    List<HistorialSaldoEntity> findAllByFechaAndTipo(LocalDate fecha, String tipo);
    Optional<HistorialSaldoEntity> findById(Long id);
    void update(HistorialSaldoEntity entidad);
    void delete(Long id);
}
