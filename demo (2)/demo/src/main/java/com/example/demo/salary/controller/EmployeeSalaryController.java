package com.example.demo.salary.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.salary.entity.EmployeeSalary;
import com.example.demo.salary.service.EmployeeSalaryService;

@RestController
@RequestMapping("/api/employee-salaries")
public class EmployeeSalaryController {

    private final EmployeeSalaryService employeeSalaryService;

    public EmployeeSalaryController(
            EmployeeSalaryService employeeSalaryService) {

        this.employeeSalaryService = employeeSalaryService;
    }

    @PostMapping
    public ResponseEntity<EmployeeSalary> assignSalary(
            @RequestBody EmployeeSalary employeeSalary) {

        EmployeeSalary created =
                employeeSalaryService.assignSalary(employeeSalary);

        return new ResponseEntity<>(
                created,
                HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<EmployeeSalary> getSalaryById(
            @PathVariable UUID id) {

        return ResponseEntity.ok(
                employeeSalaryService.getSalaryById(id));
    }

    @GetMapping("/employee/{employeeId}")
    public ResponseEntity<List<EmployeeSalary>> getSalaryHistory(
            @PathVariable UUID employeeId) {

        return ResponseEntity.ok(
                employeeSalaryService
                        .getSalaryHistory(employeeId));
    }

    @GetMapping("/employee/{employeeId}/active")
    public ResponseEntity<EmployeeSalary> getActiveSalary(
            @PathVariable UUID employeeId) {

        return ResponseEntity.ok(
                employeeSalaryService
                        .getActiveSalary(employeeId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<EmployeeSalary> updateSalary(
            @PathVariable UUID id,
            @RequestBody EmployeeSalary employeeSalary) {

        return ResponseEntity.ok(
                employeeSalaryService
                        .updateSalary(id, employeeSalary));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSalary(
            @PathVariable UUID id) {

        employeeSalaryService.deleteSalary(id);

        return ResponseEntity.noContent().build();
    }
}