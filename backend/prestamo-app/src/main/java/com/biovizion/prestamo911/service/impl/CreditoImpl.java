package com.biovizion.prestamo911.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.biovizion.prestamo911.entities.CreditoEntity;
import com.biovizion.prestamo911.entities.UsuarioEntity;
import com.biovizion.prestamo911.entities.CreditoEntity.Calificacion;
import com.biovizion.prestamo911.entities.CreditoCuotaEntity;
import com.biovizion.prestamo911.repository.CreditoRepository;
import com.biovizion.prestamo911.service.CreditoCuotaService;
import com.biovizion.prestamo911.service.CreditoService;
import com.biovizion.prestamo911.service.UsuarioService;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;

@Service
public class CreditoImpl implements CreditoService {

    @Autowired
    private CreditoRepository creditoRepository;
    
    @Autowired
    private CreditoCuotaService creditoCuotaService;
    
    @Autowired
    private UsuarioService usuarioService;

    @Override
    public List<CreditoEntity> findAll() {
        return creditoRepository.findAll();
    }
    @Override
    public CreditoEntity save(CreditoEntity producto) {
        return creditoRepository.save(producto);
    }

    @Override
    public Optional<CreditoEntity> findById(Long id) {
        return creditoRepository.findById(id);
    }
    
    @Override
    public void update(CreditoEntity producto) {
        creditoRepository.save(producto);
    }

    @Override
    public void delete(Long id) {
        creditoRepository.deleteById(id);
    }

    @Override
    public List<CreditoEntity> findPendientes() {
        return creditoRepository.findPendientes();
    }

    @Override
    public List<CreditoEntity> findAceptados() {
        return creditoRepository.findAceptados();
    }

    @Override
    public List<CreditoEntity> findRechazados() {
        return creditoRepository.findRechazados();
    }

    @Override
    public List<CreditoEntity> findFinalizados() {
        return creditoRepository.findFinalizados();
    }

    @Override
    public List<CreditoEntity> findByUsuarioId(Long id) {
        return creditoRepository.findByUsuarioId(id);
    }

    @Override
    public List<CreditoEntity> findPendientesByUsuarioId(Long id) {
        return creditoRepository.findPendientesByUsuarioId(id);
    }

    @Override
    public List<CreditoEntity> findAceptadosByUsuarioId(Long id) {
        return creditoRepository.findAceptadosByUsuarioId(id);
    }

    @Override
    public List<CreditoEntity> findRechazadosByUsuarioId(Long id) {
        return creditoRepository.findRechazadosByUsuarioId(id);
    }

    @Override
    public List<CreditoEntity> findFinalizadosByUsuarioId(Long id) {
        return creditoRepository.findFinalizadosByUsuarioId(id);
    }

    @Override
    public Optional<CreditoEntity> findMostRecentByUsuarioId(Long id) {
        return creditoRepository.findMostRecentByUsuarioId(id);
    }
    
    @Override
    public void updateCreditRatings() {
        List<CreditoEntity> creditosActivos = creditoRepository.findAceptados();
        Set<Long> affectedUserIds = new HashSet<>();

        for (CreditoEntity credito : creditosActivos) {
            // Count expired cuotas for this credit
            List<CreditoCuotaEntity> expiredCuotas = creditoCuotaService.findAllOverdueCuotasByCreditoId(credito.getId());
            int expiredCount = expiredCuotas.size();
            credito.setCuotasVencidas(expiredCount);

            // Determine rating based on expired cuotas count
            Calificacion newRating;
            if (expiredCount <= 2) {
                newRating = Calificacion.A_PLUS;
            } else if (expiredCount <= 4) {
                newRating = Calificacion.A;
            } else if (expiredCount <= 6) {
                newRating = Calificacion.B;
            } else if (expiredCount <= 8) {
                newRating = Calificacion.C;
            } else {
                newRating = Calificacion.D;
            }

            // Update the credit rating if it has changed
            if (credito.getCalificacion() != newRating) {
                if (credito.getCalificacion().ordinal() < newRating.ordinal()) {
                    credito.setCalificacion(newRating);
                }

                creditoRepository.save(credito);

                affectedUserIds.add(credito.getUsuario().getId());

                System.out.println("Updated credit ID " + credito.getId() + " rating to " + newRating);
            } else {
                System.out.println("No rating change for credit ID " + credito.getId());
            }
        }

        // Temp
        Map<Calificacion, Integer> ratingScores = Map.of(
            Calificacion.A_PLUS, 5,
            Calificacion.A, 4,
            Calificacion.B, 3,
            Calificacion.C, 2,
            Calificacion.D, 1
        );

        List<UsuarioEntity> usuarios = usuarioService.findByIdIn(affectedUserIds);   
        for (UsuarioEntity usuario : usuarios){
            List<CreditoEntity> creditos = creditoRepository.findByUsuarioId(usuario.getId());
                        
            // Skip if no creditos
            if (creditos.isEmpty()) continue;

            int totalScore = 0;
            for (CreditoEntity credito : creditos) {
                Calificacion rating = credito.getCalificacion();
                Integer score = ratingScores.get(rating);

                if (score != null) {
                    totalScore += score;
                }
            }
            
            // Calculate average score
            double averageScore = (double) totalScore / creditos.size();

            // Optionally: assign an overall rating back to user (example logic below)
            Calificacion overallRating;
            if (averageScore >= 4.75) {
                overallRating = Calificacion.A_PLUS;
            } else if (averageScore >= 4) {
                overallRating = Calificacion.A;
            } else if (averageScore >= 3) {
                overallRating = Calificacion.B;
            } else if (averageScore >= 2) {
                overallRating = Calificacion.C;
            } else {
                overallRating = Calificacion.D;
            }

            usuario.setCalificacion(overallRating.name());
            usuarioService.save(usuario);

            System.out.println("User " + usuario.getId() + " average score: " + averageScore + " => " + overallRating);
        }
    }
    @Override
    public List<CreditoEntity> findAllByEstadoAndFechaAceptado(String estado, LocalDate fecha) {
        return creditoRepository.findAllByEstadoAndFechaAceptado(estado, fecha);
    }
    @Override
    public List<CreditoEntity> findAllByEstadoAndFechaRechazado(String estado, LocalDate fecha) {
        return creditoRepository.findAllByEstadoAndFechaRechazado(estado, fecha);
    }
    @Override
    public List<CreditoEntity> findAllByDesembolsadoAndFechaDesembolsado(Boolean desembolsado, LocalDate fecha) {
        return creditoRepository.findAllByDesembolsadoAndFechaDesembolsado(desembolsado, fecha);
    }
    @Override
    public List<CreditoEntity> findAllByDesembolsado(Boolean desembolsado) {
        return creditoRepository.findAllByDesembolsado(desembolsado);
    }
}