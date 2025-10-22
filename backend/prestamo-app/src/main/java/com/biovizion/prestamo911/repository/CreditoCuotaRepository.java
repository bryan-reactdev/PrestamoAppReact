package com.biovizion.prestamo911.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import com.biovizion.prestamo911.entities.CreditoCuotaEntity;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface CreditoCuotaRepository extends JpaRepository<CreditoCuotaEntity, Long> {
    @Query("SELECT c FROM CreditoCuotaEntity c WHERE c.estado = :estado AND DATE(c.fechaPago) = :fecha")
    List<CreditoCuotaEntity> findAllByEstadoAndFechaPago(@Param("estado") String estado, @Param("fecha") LocalDate fecha);

    List<CreditoCuotaEntity> findAllByOrderByFechaVencimientoAsc();

    @Query("SELECT cc FROM CreditoCuotaEntity cc WHERE LOWER(cc.estado) = 'pendiente' ORDER BY cc.fechaVencimiento ASC")
    List<CreditoCuotaEntity> findPendientes();
    
    @Query("SELECT cc FROM CreditoCuotaEntity cc WHERE LOWER(cc.estado) = 'enrevision' ORDER BY cc.fechaPago DESC")
    List<CreditoCuotaEntity> findEnRevision();
    
    @Query("SELECT cc FROM CreditoCuotaEntity cc WHERE LOWER(cc.estado) = 'vencido' ORDER BY cc.fechaVencimiento ASC")
    List<CreditoCuotaEntity> findVencidas();

    @Query("SELECT cc FROM CreditoCuotaEntity cc WHERE LOWER(cc.estado) = 'pagado' ORDER BY cc.fechaPago DESC")
    List<CreditoCuotaEntity> findPagadas();

    
    @Query("SELECT cc FROM CreditoCuotaEntity cc WHERE cc.estado = :estado AND cc.credito.usuario.id = :usuarioId ORDER BY cc.fechaVencimiento ASC")
    List<CreditoCuotaEntity> findAllByEstadoAndUsuarioId(String estado, Long usuarioId);

    @Query("SELECT cc FROM CreditoCuotaEntity cc WHERE cc.credito.usuario.id = :usuarioId ORDER BY cc.fechaVencimiento ASC")
    List<CreditoCuotaEntity> findByUsuarioId(Long usuarioId);
    
    @Query("""
        SELECT cc
        FROM CreditoCuotaEntity cc
        WHERE cc.credito.id = :creditoId
        ORDER BY cc.fechaVencimiento ASC
    """)
    List<CreditoCuotaEntity> findByCreditoId(Long creditoId);
    
    @Query("SELECT cc FROM CreditoCuotaEntity cc WHERE cc.credito.id = :creditoId AND LOWER(cc.estado) = 'pendiente' ORDER BY cc.fechaVencimiento ASC")
    List<CreditoCuotaEntity> findPendientesByCreditoId(@Param("creditoId") Long creditoId);

    @Query("SELECT cc FROM CreditoCuotaEntity cc WHERE cc.credito.id = :creditoId AND LOWER(cc.estado) = 'enrevision' ORDER BY cc.fechaVencimiento ASC")
    List<CreditoCuotaEntity> findEnRevisionByCreditoId(@Param("creditoId") Long creditoId);

    @Query("SELECT cc FROM CreditoCuotaEntity cc WHERE cc.credito.id = :creditoId AND LOWER(TRIM(cc.estado)) = 'pagado' ORDER BY cc.fechaVencimiento ASC")
    List<CreditoCuotaEntity> findPagadasByCreditoId(@Param("creditoId") Long creditoId);
    
    @Query("SELECT cc FROM CreditoCuotaEntity cc WHERE cc.credito.id = :creditoId AND cc.pagoMora != 0 ORDER BY cc.fechaVencimiento ASC")
    List<CreditoCuotaEntity> findAllOverdueCuotasByCreditoId(Long creditoId);
    
    @Query("SELECT cc FROM CreditoCuotaEntity cc WHERE cc.credito.id = :creditoId AND LOWER(cc.estado) = 'vencido' ORDER BY cc.fechaVencimiento ASC")
    List<CreditoCuotaEntity> findVencidasByCreditoId(@Param("creditoId") Long creditoId);
    
    @Query("SELECT cc FROM CreditoCuotaEntity cc JOIN cc.credito c WHERE c.usuario.id = :usuarioId AND LOWER(cc.estado) = LOWER(:estado) ORDER BY cc.fechaVencimiento ASC")
    List<CreditoCuotaEntity> findCuotasByUsuarioIdAndEstado(@Param("usuarioId") Long usuarioId, @Param("estado") String estado);
    
    // Optimized query for large datasets - returns only IDs
    @Query("SELECT cc FROM CreditoCuotaEntity cc WHERE cc.fechaVencimiento <= :currentDate AND LOWER(cc.estado) = 'pendiente'")
    List<CreditoCuotaEntity> findExpiredForChange(@Param("currentDate") LocalDateTime currentDate);

    @Query("""
        SELECT cc.id
        FROM CreditoCuotaEntity cc
        JOIN cc.credito c
        WHERE LOWER(TRIM(cc.estado)) = 'vencido'
        AND LOWER(TRIM(c.estado)) = 'aceptado'
    """)
    List<Long> findExpiredCuotaIdsForMora();

    @Query("SELECT cc.id FROM CreditoCuotaEntity cc WHERE cc.fechaVencimiento <= :currentDate AND LOWER(cc.estado) = 'pendiente'")
    List<Long> findExpiredCuotaIds(@Param("currentDate") LocalDateTime currentDate);
    
    @Query(value = """
        UPDATE credito_cuota cc
        JOIN credito c ON c.id = cc.credito_id
        SET cc.estado = 'Vencido',
             cc.pago_mora = c.mora * DATEDIFF(:currentDate, cc.fecha_vencimiento),
            cc.total = cc.monto + (c.mora * DATEDIFF(:currentDate, cc.fecha_vencimiento))
        WHERE cc.id IN :ids
        """, nativeQuery = true)
    @Modifying
    @Transactional
    int updateCuotasToVencidoWithMora(@Param("ids") List<Long> ids, 
                                    @Param("currentDate") LocalDateTime currentDate);

    @Query(value = "SELECT c.codigo FROM credito_cuota c WHERE c.codigo LIKE CONCAT('%', :anio, '%') ORDER BY c.codigo DESC LIMIT 1", nativeQuery = true)
    Optional<String> findUltimoCodigoPorAnio(@Param("anio") int anio);    
} 