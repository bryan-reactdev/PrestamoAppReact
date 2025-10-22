package com.biovizion.prestamo911.service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import com.biovizion.prestamo911.entities.HistorialBalanceEntity;

public interface HistorialBalanceService {
    HistorialBalanceEntity save(HistorialBalanceEntity entidad);
    List<HistorialBalanceEntity> findAll();
    HistorialBalanceEntity findByFecha(LocalDate fecha);
    Optional<HistorialBalanceEntity> findById(Long id);
    void update(HistorialBalanceEntity entidad);
    void delete(Long id);
}
