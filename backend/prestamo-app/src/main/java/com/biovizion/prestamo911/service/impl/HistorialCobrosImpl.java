package com.biovizion.prestamo911.service.impl;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.biovizion.prestamo911.entities.HistorialCobrosEntity;
import com.biovizion.prestamo911.repository.HistorialCobrosRepository;
import com.biovizion.prestamo911.service.HistorialCobrosService;

@Service
public class HistorialCobrosImpl implements HistorialCobrosService {

    @Autowired
    private HistorialCobrosRepository historialCobrosRepository;

    @Override
    public HistorialCobrosEntity save(HistorialCobrosEntity entidad) {
        return historialCobrosRepository.save(entidad);
    }

    @Override
    public List<HistorialCobrosEntity> findAll() {
        return historialCobrosRepository.findAll();
    }

    @Override
    public List<HistorialCobrosEntity> findAllByTipo(String tipo) {
        return historialCobrosRepository.findAllByTipo(tipo);
    }

    @Override
    public Optional<HistorialCobrosEntity> findById(Long id) {
        return historialCobrosRepository.findById(id);
    }

    @Override
    public List<HistorialCobrosEntity> findAllByFecha(LocalDate fecha) {
        return historialCobrosRepository.findAllByFecha(fecha);
    }

    @Override
    public HistorialCobrosEntity findByFechaAndTipo(LocalDate fecha, String tipo) {
        return historialCobrosRepository.findByFechaAndTipo(fecha, tipo);
    }

    @Override
    public void update(HistorialCobrosEntity entidad) {
        historialCobrosRepository.save(entidad);
    }

    @Override
    public void delete(Long id) {
        historialCobrosRepository.deleteById(id);
    }
}

