package com.biovizion.prestamo911.repository;

import com.biovizion.prestamo911.entities.AbonoCuotaEntity;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface AbonoCuotaRepository extends JpaRepository<AbonoCuotaEntity, Long> {
    @Query("SELECT a FROM AbonoCuotaEntity a WHERE a.fechaAbono = :fechaAbono")
    List<AbonoCuotaEntity> findAllByFecha(LocalDate fechaAbono);
}