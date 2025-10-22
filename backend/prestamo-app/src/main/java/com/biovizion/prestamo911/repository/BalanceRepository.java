package com.biovizion.prestamo911.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.biovizion.prestamo911.entities.BalanceEntity;

public interface BalanceRepository extends JpaRepository<BalanceEntity, Long> {
}
