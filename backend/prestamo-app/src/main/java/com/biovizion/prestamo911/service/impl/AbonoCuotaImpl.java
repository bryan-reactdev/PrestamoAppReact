package com.biovizion.prestamo911.service.impl;

import com.biovizion.prestamo911.entities.AbonoCuotaEntity;
import com.biovizion.prestamo911.repository.AbonoCuotaRepository;
import com.biovizion.prestamo911.service.AbonoCuotaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class AbonoCuotaImpl implements AbonoCuotaService {

    @Autowired
    private AbonoCuotaRepository abonoCuotaRepository;

    public AbonoCuotaImpl(AbonoCuotaRepository abonoCuotaRepository) {
        this.abonoCuotaRepository = abonoCuotaRepository;
    }

    @Override
    public List<AbonoCuotaEntity> findAll() {
        return abonoCuotaRepository.findAll();
    }

    @Override
    public List<AbonoCuotaEntity> findAllByFecha(LocalDate fechaAbono) {
        return abonoCuotaRepository.findAllByFecha(fechaAbono);
    }

    @Override
    public AbonoCuotaEntity findById(Long id) {
        return abonoCuotaRepository.findById(id).orElse(null);
    }

    @Override
    public AbonoCuotaEntity save(AbonoCuotaEntity abonoCuota) {
        return abonoCuotaRepository.save(abonoCuota);
    }

    @Override
    public void deleteById(Long id) {
        abonoCuotaRepository.deleteById(id);
    }
}