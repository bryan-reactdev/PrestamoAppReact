package com.biovizion.prestamo911.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.biovizion.prestamo911.entities.MensajeEntity;
import com.biovizion.prestamo911.repository.MensajeRepository;
import com.biovizion.prestamo911.service.MensajeService;

import java.util.List;
import java.util.Optional;

@Service
public class MensajeImpl implements MensajeService {

    @Autowired
    private MensajeRepository mensajeRepository;

    @Override
    public List<MensajeEntity> findAll() {
        return mensajeRepository.findAll();
    }
    @Override
    public MensajeEntity save(MensajeEntity usuario) {
        return mensajeRepository.save(usuario);
    }

    @Override
    public Optional<MensajeEntity> findById(Long id) {
        return mensajeRepository.findById(id);
    }

    @Override
    public List<MensajeEntity> findByLeido(Boolean leido) {
        return mensajeRepository.findByLeido(leido);
    }

    @Override
    public void update(MensajeEntity usuario) {
        mensajeRepository.save(usuario);
    }

    @Override
    public void delete(Long id) {
        mensajeRepository.deleteById(id);
    }
}
