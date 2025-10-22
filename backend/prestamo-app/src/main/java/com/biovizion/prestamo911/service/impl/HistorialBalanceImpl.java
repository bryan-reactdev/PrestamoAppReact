package com.biovizion.prestamo911.service.impl;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.biovizion.prestamo911.entities.HistorialBalanceEntity;
import com.biovizion.prestamo911.repository.HistorialBalanceRepository;
import com.biovizion.prestamo911.service.HistorialBalanceService;

@Service
public class HistorialBalanceImpl implements HistorialBalanceService {
    @Autowired
    private HistorialBalanceRepository historialBalanceRepository;

    @Override
    public HistorialBalanceEntity save(HistorialBalanceEntity entidad) {
        return historialBalanceRepository.save(entidad);
    }

    @Override
    public List<HistorialBalanceEntity> findAll() {
        return historialBalanceRepository.findAll();
    }

    @Override
    public HistorialBalanceEntity findByFecha(LocalDate fecha) {
        return historialBalanceRepository.findByFecha(fecha);
    }

    @Override
    public Optional<HistorialBalanceEntity> findById(Long id) {
        return historialBalanceRepository.findById(id);
    }

    @Override
    public void update(HistorialBalanceEntity entidad) {
        historialBalanceRepository.save(entidad);
    }

    @Override
    public void delete(Long id) {
        historialBalanceRepository.deleteById(id);
    }
}
