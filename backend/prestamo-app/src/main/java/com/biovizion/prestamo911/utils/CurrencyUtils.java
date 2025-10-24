package com.biovizion.prestamo911.utils;

import java.math.BigDecimal;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.biovizion.prestamo911.entities.BalanceEntity;
import com.biovizion.prestamo911.service.BalanceService;

@Component
public class CurrencyUtils {

    @Autowired
    private BalanceService balanceService;

    public void addFondos(BigDecimal monto) {
        BalanceEntity balance = balanceService.get();
        balance.setSaldo(balance.getSaldo().add(monto));
        balanceService.save(balance);
    }

    public void removeFondos(BigDecimal monto) {
        BalanceEntity balance = balanceService.get();
        balance.setSaldo(balance.getSaldo().subtract(monto));
        balanceService.save(balance);
    }
}