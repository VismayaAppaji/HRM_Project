
package com.example.demo.payroll.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.payroll.entity.Payroll;

public interface PayrollRepository extends JpaRepository<Payroll, UUID> {

    List<Payroll> findByEmployeeId(UUID employeeId);

    Optional<Payroll> findByEmployeeIdAndPayPeriod(
            UUID employeeId,
            String payPeriod);

    boolean existsByEmployeeIdAndPayPeriod(
            UUID employeeId,
            String payPeriod);
}