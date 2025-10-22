package com.biovizion.prestamo911.service;

import com.biovizion.prestamo911.entities.AbonoCuotaEntity;

import java.time.LocalDate;
import java.util.List;

public interface AbonoCuotaService {

    List<AbonoCuotaEntity> findAll();
    List<AbonoCuotaEntity> findAllByFecha(LocalDate fechaAbono);
    AbonoCuotaEntity findById(Long id);
    AbonoCuotaEntity save(AbonoCuotaEntity abonoCuota);
    void deleteById(Long id);
}
