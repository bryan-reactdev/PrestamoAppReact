package com.biovizion.prestamo911.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.biovizion.prestamo911.entities.MensajeEntity;

@Repository
public interface MensajeRepository extends JpaRepository<MensajeEntity, Long> {
    List<MensajeEntity> findByLeido(Boolean leido);
}