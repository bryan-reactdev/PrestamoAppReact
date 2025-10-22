package com.biovizion.prestamo911.service.impl;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.biovizion.prestamo911.entities.HistorialSaldoEntity;
import com.biovizion.prestamo911.repository.HistorialSaldoRepository;
import com.biovizion.prestamo911.service.HistorialSaldoService;

@Service
public class HistorialSaldoImpl implements HistorialSaldoService {

    @Autowired
    private HistorialSaldoRepository historialSaldoRepository;

    @Override
    public HistorialSaldoEntity save(HistorialSaldoEntity entidad) {
        return historialSaldoRepository.save(entidad);
    }

    @Override
    public List<HistorialSaldoEntity> findAll() {
        return historialSaldoRepository.findAll();
    }


    @Override
    public List<HistorialSaldoEntity> findAllByTipo(String tipo) {
        return historialSaldoRepository.findAllByTipo(tipo);
    }

    @Override
    public Optional<HistorialSaldoEntity> findById(Long id) {
        return historialSaldoRepository.findById(id);
    }

    @Override
    public List<HistorialSaldoEntity> findAllByFecha(LocalDate fecha) {
        return historialSaldoRepository.findAllByFecha(fecha);
    }


    @Override
    public List<HistorialSaldoEntity> findAllByFechaAndTipo(LocalDate fecha, String tipo) {
        return historialSaldoRepository.findAllByFechaAndTipo(fecha, tipo);
    }

    @Override
    public void update(HistorialSaldoEntity entidad) {
        historialSaldoRepository.save(entidad);
    }

    @Override
    public void delete(Long id) {
        historialSaldoRepository.deleteById(id);
    }
}
