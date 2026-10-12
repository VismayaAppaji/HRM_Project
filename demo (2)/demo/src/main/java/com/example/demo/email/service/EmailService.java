package com.example.demo.email.service;

import java.util.UUID;

public interface EmailService {

    void sendPayslipEmail(
            UUID employeeId,
            UUID payrollId,
            String employeeEmail,
            String payPeriod,
            byte[] payslipPdf);
}