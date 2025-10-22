package com.biovizion.prestamo911.service.impl;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.biovizion.prestamo911.entities.NotaEntity;
import com.biovizion.prestamo911.repository.NotaRepository;
import com.biovizion.prestamo911.service.NotaService;

@Service
public class NotaImpl implements NotaService {
    @Autowired
    private NotaRepository notaRepository;

    @Override
    public NotaEntity save(NotaEntity nota) {
        return notaRepository.save(nota);
    }

    @Override
    public List<NotaEntity> findAll() {
        return notaRepository.findAll();
    }

    @Override
    public Optional<NotaEntity> findById(Long id) {
        return notaRepository.findById(id);
    }

    @Override
    public void update(NotaEntity nota) {
        notaRepository.save(nota);
    }

    @Override
    public void delete(Long id) {
        notaRepository.deleteById(id);
    }
}