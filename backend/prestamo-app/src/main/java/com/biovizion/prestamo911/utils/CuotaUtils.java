package com.biovizion.prestamo911.utils;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.biovizion.prestamo911.entities.CreditoCuotaEntity;
import com.biovizion.prestamo911.entities.CreditoEntity;
import com.biovizion.prestamo911.service.CreditoCuotaService;
import com.biovizion.prestamo911.service.CreditoService;

@Component
public class CuotaUtils {
    @Autowired
    private CurrencyUtils currencyUtils;

    @Autowired
    private CreditoCuotaService cuotaService;

    @Autowired
    private CreditoService creditoService;
    
    public void pagarCuota(CreditoCuotaEntity cuota){
        currencyUtils.addFondos(cuota.getTotal());
        cuota.setEstado("Pagado");
        cuota.setFechaPago(LocalDateTime.now());

        CreditoEntity credito = cuota.getCredito();
        List<CreditoCuotaEntity> cuotasDeCredito = credito.getCuotas();

        long pendientes = cuotasDeCredito.stream()
            .filter(c -> !"Pagado".equals(c.getEstado()))
            .count();

        if (pendientes <= 0) {
            credito.setEstado("Finalizado");
            creditoService.save(credito);
        }

        cuotaService.save(cuota);
    }
}
