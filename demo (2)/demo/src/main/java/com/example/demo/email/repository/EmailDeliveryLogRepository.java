package com.example.demo.email.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.email.entity.EmailDeliveryLog;

public interface EmailDeliveryLogRepository
        extends JpaRepository<EmailDeliveryLog, UUID> {

    List<EmailDeliveryLog> findByEmployeeId(UUID employeeId);

    List<EmailDeliveryLog> findByPayrollId(UUID payrollId);

    List<EmailDeliveryLog> findByPayPeriod(String payPeriod);
}