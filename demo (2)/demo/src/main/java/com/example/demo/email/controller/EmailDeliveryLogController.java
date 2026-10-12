package com.example.demo.email.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.demo.email.entity.EmailDeliveryLog;
import com.example.demo.email.repository.EmailDeliveryLogRepository;

@RestController
@RequestMapping("/api/email-logs")
public class EmailDeliveryLogController {

    private final EmailDeliveryLogRepository emailDeliveryLogRepository;

    public EmailDeliveryLogController(
            EmailDeliveryLogRepository emailDeliveryLogRepository) {
        this.emailDeliveryLogRepository = emailDeliveryLogRepository;
    }

    @GetMapping
    public ResponseEntity<List<EmailDeliveryLog>> getAllLogs() {
        return ResponseEntity.ok(
                emailDeliveryLogRepository.findAll());
    }

    @GetMapping("/employee/{employeeId}")
    public ResponseEntity<List<EmailDeliveryLog>> getLogsByEmployee(
            @PathVariable UUID employeeId) {

        return ResponseEntity.ok(
                emailDeliveryLogRepository.findByEmployeeId(employeeId));
    }

    @GetMapping("/payroll/{payrollId}")
    public ResponseEntity<List<EmailDeliveryLog>> getLogsByPayroll(
            @PathVariable UUID payrollId) {

        return ResponseEntity.ok(
                emailDeliveryLogRepository.findByPayrollId(payrollId));
    }
}