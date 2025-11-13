package com.biovizion.prestamo911.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.biovizion.prestamo911.entities.CreditoCuotaEntity;
import com.biovizion.prestamo911.repository.CreditoCuotaRepository;
import com.biovizion.prestamo911.service.CreditoCuotaService;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class CreditoCuotaImpl implements CreditoCuotaService {
    
    @Autowired
    private CreditoCuotaRepository creditoCuotaRepository;

    @Override
    public List<CreditoCuotaEntity> findAll() {
        return creditoCuotaRepository.findAllByOrderByFechaVencimientoAsc();
    }

    @Override
    public CreditoCuotaEntity save(CreditoCuotaEntity creditoCuota) {
        return creditoCuotaRepository.save(creditoCuota);
    }
    
    @Override
    public List<CreditoCuotaEntity> saveAll(List<CreditoCuotaEntity> creditoCuotas) {
        return creditoCuotaRepository.saveAll(creditoCuotas);
    }

    @Override
    public Optional<CreditoCuotaEntity> findById(Long id) {
        return creditoCuotaRepository.findById(id);
    }
    
    @Override
    public void update(CreditoCuotaEntity creditoCuota) {
        creditoCuotaRepository.save(creditoCuota);
    }

    @Override
    public void delete(Long id) {
        creditoCuotaRepository.deleteById(id);
    }

    @Override
    public List<CreditoCuotaEntity> findByCreditoId(Long creditoId) {
        return creditoCuotaRepository.findByCreditoId(creditoId);
    }

    @Override
    public List<CreditoCuotaEntity> findPendientes() {
        return creditoCuotaRepository.findPendientes();
    }

    @Override
    public List<CreditoCuotaEntity> findPagadas() {
        return creditoCuotaRepository.findPagadas();
    }

    @Override
    public List<CreditoCuotaEntity> findVencidas() {
        return creditoCuotaRepository.findVencidas();
    }

    @Override
    public List<CreditoCuotaEntity> findAllByEstadoAndUsuarioId(String estado, Long usuarioId){
        return creditoCuotaRepository.findAllByEstadoAndUsuarioId(estado, usuarioId);
    }

    @Override
    public List<CreditoCuotaEntity> findByUsuarioId(Long usuarioId) {
        return creditoCuotaRepository.findByUsuarioId(usuarioId);
    }

    @Override
    public List<CreditoCuotaEntity> findEnRevision() {
        return creditoCuotaRepository.findEnRevision();
    }

    @Override
    public List<CreditoCuotaEntity> findPendientesByCreditoId(Long creditoId) {
        return creditoCuotaRepository.findPendientesByCreditoId(creditoId);
    }

    @Override
    public List<CreditoCuotaEntity> findEnRevisionByCreditoId(Long creditoId) {
        return creditoCuotaRepository.findEnRevisionByCreditoId(creditoId);
    }

    @Override
    public List<CreditoCuotaEntity> findPagadasByCreditoId(Long creditoId) {
        return creditoCuotaRepository.findPagadasByCreditoId(creditoId);
    }

    @Override
    public List<CreditoCuotaEntity> findVencidasByCreditoId(Long creditoId) {
        return creditoCuotaRepository.findVencidasByCreditoId(creditoId);
    }

    @Override
    public String generarCodigo() {
        int año = LocalDate.now().getYear();
        Optional<String> ultimoCodigoOpt = creditoCuotaRepository.findUltimoCodigoPorAnio(año);

        String serie = "CUO";
        int contador = 1;

        if (ultimoCodigoOpt.isPresent()) {
            String ultimoCodigo = ultimoCodigoOpt.get();
            String[] partes = ultimoCodigo.split("-");
            serie = partes[0];
            int numero = Integer.parseInt(partes[2]);

            if (numero >= 99999) {
                // Incrementa la serie
                if (serie.equals("CUO")) serie = "CUO1";
                else {
                    String sufijo = serie.substring(3);
                    int n = sufijo.isEmpty() ? 1 : Integer.parseInt(sufijo) + 1;
                    serie = "CUO" + n;
                }
                contador = 1;
            } else {
                contador = numero + 1;
            }
        }

        return serie + "-" + año + "-" + String.format("%04d", contador);
    }

    @Override
    public List<CreditoCuotaEntity> findByUsuarioIdAndEstado(Long usuarioId, String estado) {
        return creditoCuotaRepository.findCuotasByUsuarioIdAndEstado(usuarioId, estado);
    }

    @Override
    public void updateCuotasMora() {
        List<Long> expiredCuotaIds = creditoCuotaRepository.findExpiredCuotaIdsForMora();
        
        if (expiredCuotaIds.isEmpty()){
            System.out.println("No expired cuotas for mora calculation found");
        }

        processBatchForMora(expiredCuotaIds);
    }

    public void updateExpiredCuotas() {
        LocalDateTime currentDate = LocalDate.now().atTime(12, 00);
        List<Long> expiredCuotaIds = creditoCuotaRepository.findExpiredCuotaIds(currentDate);
        
        if (!expiredCuotaIds.isEmpty()) {
            processBatchWithMora(expiredCuotaIds, currentDate, "expired", "Vencido");
        } else {
            System.out.println("No expired cuotas found");
        }
    }

    private void processBatchWithMora(List<Long> cuotaIds, LocalDateTime currentDate, 
                                    String description, String newState) {
        int batchSize = 1000;
        int totalUpdated = 0;
        
        for (int i = 0; i < cuotaIds.size(); i += batchSize) {
            int endIndex = Math.min(i + batchSize, cuotaIds.size());
            List<Long> batch = cuotaIds.subList(i, endIndex);
            
            int updatedCount = creditoCuotaRepository.updateCuotasToVencidoWithMora(batch, currentDate);
            totalUpdated += updatedCount;
        }
        
        System.out.println("Updated " + totalUpdated + " " + description + " cuotas to " + newState + " with mora calculation");
    }
    
    private void processBatchForMora(List<Long> cuotaIds) {
        LocalDateTime currentDate = LocalDate.now().atTime(12, 00);

        int batchSize = 1000;
        int totalUpdated = 0;
        
        for (int i = 0; i < cuotaIds.size(); i += batchSize) {
            int endIndex = Math.min(i + batchSize, cuotaIds.size());
            List<Long> batch = cuotaIds.subList(i, endIndex);
            
            int updatedCount = creditoCuotaRepository.updateCuotasToVencidoWithMora(batch, currentDate);
            totalUpdated += updatedCount;
        }
        
        System.out.println("Updated " + totalUpdated + " cuotas' mora");
    }

    @Override
    public List<CreditoCuotaEntity> findAllByEstadoAndFechaPago(String estado, LocalDate fecha) {
        return creditoCuotaRepository.findAllByEstadoAndFechaPago(estado, fecha);
    }

    @Override
    public List<CreditoCuotaEntity> findAllByEstadoAndFechaVencimiento(String estado, LocalDate fecha) {
        return creditoCuotaRepository.findAllByEstadoAndFechaVencimiento(estado, fecha);
    }

    @Override
    public List<CreditoCuotaEntity> findAllOverdueCuotasByCreditoId(Long creditoId) {
        return creditoCuotaRepository.findAllOverdueCuotasByCreditoId(creditoId);
    }
} 