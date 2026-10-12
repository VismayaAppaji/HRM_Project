package com.example.demo.email.controller;

import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.demo.email.service.EmailService;
import com.example.demo.employee.entity.Employee;
import com.example.demo.employee.repository.EmployeeRepository;
import com.example.demo.payslip.service.PayslipService;
import com.example.demo.payroll.entity.Payroll;
import com.example.demo.payroll.repository.PayrollRepository;

@RestController
@RequestMapping("/api/emails")
public class EmailController {

    private final EmailService emailService;
    private final PayrollRepository payrollRepository;
    private final EmployeeRepository employeeRepository;
    private final PayslipService payslipService;

    public EmailController(
            EmailService emailService,
            PayrollRepository payrollRepository,
            EmployeeRepository employeeRepository,
            PayslipService payslipService) {

        this.emailService = emailService;
        this.payrollRepository = payrollRepository;
        this.employeeRepository = employeeRepository;
        this.payslipService = payslipService;
    }

    @PostMapping("/payslip/{payrollId}")
    public ResponseEntity<String> sendPayslipEmail(
            @PathVariable UUID payrollId) {

        Payroll payroll = payrollRepository.findById(payrollId)
                .orElseThrow(() ->
                        new RuntimeException("Payroll not found"));

        Employee employee = employeeRepository
                .findById(payroll.getEmployeeId())
                .orElseThrow(() ->
                        new RuntimeException("Employee not found"));

        byte[] payslipPdf =
                payslipService.generatePayslipPdf(payrollId);

        emailService.sendPayslipEmail(
                employee.getId(),
                payroll.getId(),
                employee.getEmail(),
                payroll.getPayPeriod(),
                payslipPdf);

        return ResponseEntity.ok(
                "Payslip email sent successfully to "
                        + employee.getEmail());
    }
}