package com.biovizion.prestamo911.service.impl;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.biovizion.prestamo911.entities.HistorialGastoEntity;
import com.biovizion.prestamo911.repository.HistorialGastoRepository;
import com.biovizion.prestamo911.service.HistorialGastoService;

@Service
public class HistorialGastoImpl implements HistorialGastoService {

    @Autowired
    private HistorialGastoRepository historialGastoRepository;

    @Override
    public HistorialGastoEntity save(HistorialGastoEntity entidad) {
        return historialGastoRepository.save(entidad);
    }

    @Override
    public List<HistorialGastoEntity> findAll() {
        return historialGastoRepository.findAll();
    }

    @Override
    public List<HistorialGastoEntity> findAllByTipo(String tipo) {
        return historialGastoRepository.findAllByTipo(tipo);
    }

    @Override
    public Optional<HistorialGastoEntity> findById(Long id) {
        return historialGastoRepository.findById(id);
    }

    @Override
    public List<HistorialGastoEntity> findAllByFecha(LocalDate fecha) {
        return historialGastoRepository.findAllByFecha(fecha);
    }

    @Override
    public List<HistorialGastoEntity> findAllByFechaAndTipo(LocalDate fecha, String tipo){
        return historialGastoRepository.findAllByFechaAndTipo(fecha, tipo);
    }

    @Override
    public void update(HistorialGastoEntity entidad) {
        historialGastoRepository.save(entidad);
    }

    @Override
    public void delete(Long id) {
        historialGastoRepository.deleteById(id);
    }
}
