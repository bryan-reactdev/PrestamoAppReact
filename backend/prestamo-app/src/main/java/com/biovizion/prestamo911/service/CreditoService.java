package com.biovizion.prestamo911.service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import com.biovizion.prestamo911.entities.CreditoEntity;

public interface CreditoService {
    CreditoEntity save(CreditoEntity producto);
    List<CreditoEntity> findAll();
    Optional<CreditoEntity> findById(Long id);
    public void update(CreditoEntity producto);
    public void delete(Long id);
    
    List<CreditoEntity> findAllByDesembolsado(Boolean desembolsado);
    List<CreditoEntity> findPendientes();
    List<CreditoEntity> findAceptados();
    List<CreditoEntity> findRechazados();
    List<CreditoEntity> findFinalizados();

    List<CreditoEntity> findByUsuarioId(Long id);
    List<CreditoEntity> findPendientesByUsuarioId(Long id);
    List<CreditoEntity> findAceptadosByUsuarioId(Long id);
    List<CreditoEntity> findRechazadosByUsuarioId(Long id);
    List<CreditoEntity> findFinalizadosByUsuarioId(Long id);

    List<CreditoEntity> findAllByEstadoAndFechaAceptado(String estado, LocalDate fecha);
    List<CreditoEntity> findAllByEstadoAndFechaRechazado(String estado, LocalDate fecha);
    List<CreditoEntity> findAllByDesembolsadoAndFechaDesembolsado(Boolean desembolsado, LocalDate fecha);
    
    Optional<CreditoEntity> findMostRecentByUsuarioId(Long id);
    
    void updateCreditRatings();
}
