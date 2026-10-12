package com.example.demo.email.serviceimpl;

import java.time.LocalDateTime;
import java.util.UUID;

import org.springframework.core.io.ByteArrayResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import com.example.demo.email.entity.EmailDeliveryLog;
import com.example.demo.email.repository.EmailDeliveryLogRepository;
import com.example.demo.email.service.EmailService;

import jakarta.mail.internet.MimeMessage;

@Service
public class EmailServiceImpl implements EmailService {

    private final JavaMailSender mailSender;
    private final EmailDeliveryLogRepository emailDeliveryLogRepository;

    public EmailServiceImpl(
            JavaMailSender mailSender,
            EmailDeliveryLogRepository emailDeliveryLogRepository) {

        this.mailSender = mailSender;
        this.emailDeliveryLogRepository = emailDeliveryLogRepository;
    }

    @Override
    public void sendPayslipEmail(
            UUID employeeId,
            UUID payrollId,
            String employeeEmail,
            String payPeriod,
            byte[] payslipPdf) {

        EmailDeliveryLog log = new EmailDeliveryLog();

        log.setEmployeeId(employeeId);
        log.setPayrollId(payrollId);
        log.setRecipientEmail(employeeEmail);
        log.setPayPeriod(payPeriod);

        try {
            MimeMessage message = mailSender.createMimeMessage();

            MimeMessageHelper helper =
                    new MimeMessageHelper(message, true);

            helper.setTo(employeeEmail);
            helper.setSubject("Payslip for " + payPeriod);

            helper.setText(
                    "Dear Employee,\n\n"
                    + "Please find attached your payslip "
                    + "for the pay period " + payPeriod + ".\n\n"
                    + "Employee ID: " + employeeId + "\n\n"
                    + "Regards,\n"
                    + "HRM Payroll System");

            helper.addAttachment(
                    "payslip-" + payPeriod + ".pdf",
                    new ByteArrayResource(payslipPdf));

            mailSender.send(message);

            log.setStatus("SENT");
            log.setSentAt(LocalDateTime.now());

        } catch (Exception e) {

            log.setStatus("FAILED");
            log.setErrorMessage(e.getMessage());
            log.setSentAt(LocalDateTime.now());

            emailDeliveryLogRepository.save(log);

            throw new RuntimeException(
                    "Failed to send payslip email", e);
        }

        emailDeliveryLogRepository.save(log);
    }
}