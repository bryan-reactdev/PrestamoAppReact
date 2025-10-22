package com.biovizion.prestamo911.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.biovizion.prestamo911.entities.NotaEntity;

public interface NotaRepository extends JpaRepository<NotaEntity, Long> {
    
}