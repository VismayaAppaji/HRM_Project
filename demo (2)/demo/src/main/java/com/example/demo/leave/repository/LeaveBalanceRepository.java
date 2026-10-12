package com.example.demo.leave.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.leave.entity.LeaveBalance;

public interface LeaveBalanceRepository
        extends JpaRepository<LeaveBalance, UUID> {

    Optional<LeaveBalance> findByEmployeeId(UUID employeeId);

    boolean existsByEmployeeId(UUID employeeId);
}