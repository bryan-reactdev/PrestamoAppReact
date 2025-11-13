package com.biovizion.prestamo911.service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import com.biovizion.prestamo911.entities.CreditoCuotaEntity;

public interface CreditoCuotaService {
    CreditoCuotaEntity save(CreditoCuotaEntity creditoCuota);
    List<CreditoCuotaEntity> saveAll(List<CreditoCuotaEntity> creditoCuotas);
    List<CreditoCuotaEntity> findAll();
    Optional<CreditoCuotaEntity> findById(Long id);
    List<CreditoCuotaEntity> findAllByEstadoAndFechaPago(String estado, LocalDate fecha);
    List<CreditoCuotaEntity> findAllByEstadoAndFechaVencimiento(String estado, LocalDate fecha);
    void update(CreditoCuotaEntity creditoCuota);
    void delete(Long id);
    void updateCuotasMora();
    void updateExpiredCuotas();
    
    List<CreditoCuotaEntity> findPendientes();
    List<CreditoCuotaEntity> findEnRevision();
    List<CreditoCuotaEntity> findVencidas();
    List<CreditoCuotaEntity> findPagadas();
    List<CreditoCuotaEntity> findAllByEstadoAndUsuarioId(String estado, Long usuarioId);

    List<CreditoCuotaEntity> findByUsuarioId(Long usuarioId);
    List<CreditoCuotaEntity> findByUsuarioIdAndEstado(Long usuarioId, String estado);
    
    List<CreditoCuotaEntity> findByCreditoId(Long creditoId);
    List<CreditoCuotaEntity> findPendientesByCreditoId(Long creditoId);
    List<CreditoCuotaEntity> findEnRevisionByCreditoId(Long creditoId);
    List<CreditoCuotaEntity> findPagadasByCreditoId(Long creditoId);
    List<CreditoCuotaEntity> findVencidasByCreditoId(Long creditoId);

    List<CreditoCuotaEntity> findAllOverdueCuotasByCreditoId(Long creditoId);

    String generarCodigo();
} 