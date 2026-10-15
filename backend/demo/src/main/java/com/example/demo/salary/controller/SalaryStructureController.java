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

import com.example.demo.salary.entity.SalaryStructure;
import com.example.demo.salary.service.SalaryStructureService;

@RestController
@RequestMapping("/api/salary-structures")
public class SalaryStructureController {

    private final SalaryStructureService salaryStructureService;

    public SalaryStructureController(
            SalaryStructureService salaryStructureService) {

        this.salaryStructureService = salaryStructureService;
    }

    @PostMapping
    public ResponseEntity<SalaryStructure> createSalaryStructure(
            @RequestBody SalaryStructure salaryStructure) {

        SalaryStructure created =
                salaryStructureService.createSalaryStructure(
                        salaryStructure);

        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<SalaryStructure>>
            getAllSalaryStructures() {

        return ResponseEntity.ok(
                salaryStructureService.getAllSalaryStructures());
    }

    @GetMapping("/{id}")
    public ResponseEntity<SalaryStructure> getSalaryStructureById(
            @PathVariable UUID id) {

        return ResponseEntity.ok(
                salaryStructureService.getSalaryStructureById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<SalaryStructure> updateSalaryStructure(
            @PathVariable UUID id,
            @RequestBody SalaryStructure salaryStructure) {

        return ResponseEntity.ok(
                salaryStructureService.updateSalaryStructure(
                        id, salaryStructure));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSalaryStructure(
            @PathVariable UUID id) {

        salaryStructureService.deleteSalaryStructure(id);

        return ResponseEntity.noContent().build();
    }
}