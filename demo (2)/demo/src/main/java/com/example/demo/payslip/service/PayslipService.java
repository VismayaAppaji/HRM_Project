package com.example.demo.payslip.service;

import java.util.UUID;

import org.springframework.security.core.Authentication;

public interface PayslipService {

    // Used internally when payroll generates a payslip automatically
    byte[] generatePayslipPdf(UUID payrollId);

    // Used when an authenticated user downloads a payslip
    byte[] generatePayslipPdf(
            UUID payrollId,
            Authentication authentication);
}