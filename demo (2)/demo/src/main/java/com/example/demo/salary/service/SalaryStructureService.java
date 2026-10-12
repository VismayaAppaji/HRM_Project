package com.example.demo.salary.service;

import java.util.List;
import java.util.UUID;

import com.example.demo.salary.entity.SalaryStructure;

public interface SalaryStructureService {

    SalaryStructure createSalaryStructure(SalaryStructure salaryStructure);

    SalaryStructure getSalaryStructureById(UUID id);

    List<SalaryStructure> getAllSalaryStructures();

    SalaryStructure updateSalaryStructure(
            UUID id,
            SalaryStructure salaryStructure);

    void deleteSalaryStructure(UUID id);
}