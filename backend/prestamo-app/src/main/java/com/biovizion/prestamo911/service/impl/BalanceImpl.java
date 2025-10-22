package com.biovizion.prestamo911.service.impl;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.biovizion.prestamo911.entities.BalanceEntity;
import com.biovizion.prestamo911.repository.BalanceRepository;
import com.biovizion.prestamo911.service.BalanceService;

@Service
public class BalanceImpl implements BalanceService {

    @Autowired
    private BalanceRepository balanceRepository;

    @Override
    public BalanceEntity save(BalanceEntity entidad) {
        return balanceRepository.save(entidad);
    }

    @Override
    public List<BalanceEntity> findAll() {
        return balanceRepository.findAll();
    }

    @Override
    public BalanceEntity get() {
        return balanceRepository.findById(1L)
                                         .orElse(new BalanceEntity());
    }
    

    @Override
    public void update(BalanceEntity entidad) {
        balanceRepository.save(entidad);
    }

    @Override
    public void delete(Long id) {
        balanceRepository.deleteById(id);
    }
}
