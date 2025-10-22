package com.biovizion.prestamo911.service;

import java.util.List;
import com.biovizion.prestamo911.entities.BalanceEntity;

public interface BalanceService {
    BalanceEntity save(BalanceEntity entidad);
    List<BalanceEntity> findAll();
    BalanceEntity get();
    void update(BalanceEntity entidad);
    void delete(Long id);
}
