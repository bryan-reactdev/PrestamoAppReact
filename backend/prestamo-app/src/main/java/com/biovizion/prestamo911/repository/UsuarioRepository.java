package com.biovizion.prestamo911.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.biovizion.prestamo911.entities.UsuarioEntity;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<UsuarioEntity, Long> {
    Optional<UsuarioEntity> findById(Long id);
    List<UsuarioEntity> findByIdIn(Collection<Long> ids);
    Optional<UsuarioEntity> findByDui(String dui);

    boolean existsByCodigo(String codigo);

    @Query("""
        SELECT u
        FROM UsuarioEntity u
        WHERE EXISTS (
            SELECT 1
            FROM CreditoEntity c
            JOIN c.cuotas cc
            WHERE c.usuario = u
            AND cc.estado = 'Vencido'
        )
    """)
    List<UsuarioEntity> findAllWithVencidos();

    @Query("""
        SELECT u
        FROM UsuarioEntity u
        WHERE EXISTS (
            SELECT 1
            FROM CreditoEntity c
            JOIN c.cuotas cc
            WHERE c.usuario = u
            AND (cc.estado = 'Pendiente' OR cc.estado = 'Vencido')
        )
    """)
    List<UsuarioEntity> findAllWithCuotas();

    // Metodo para filtrar usuarios que tienen el rol ROLE_ADMIN
    @Query("SELECT u FROM UsuarioEntity u WHERE u.rol = :rolNombre  ORDER BY u.id DESC")
    List<UsuarioEntity> findByRolNombre(@Param("rolNombre") String rolNombre);
}
