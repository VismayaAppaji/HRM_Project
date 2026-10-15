package com.example.demo.salary.serviceimpl;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.example.demo.salary.entity.SalaryStructure;
import com.example.demo.salary.repository.SalaryStructureRepository;
import com.example.demo.salary.service.SalaryStructureService;

@Service
public class SalaryStructureServiceImpl implements SalaryStructureService {

    private final SalaryStructureRepository salaryStructureRepository;

    public SalaryStructureServiceImpl(
            SalaryStructureRepository salaryStructureRepository) {

        this.salaryStructureRepository = salaryStructureRepository;
    }

    @Override
    public SalaryStructure createSalaryStructure(
            SalaryStructure salaryStructure) {

        if (salaryStructureRepository
                .existsByStructureName(salaryStructure.getStructureName())) {

            throw new RuntimeException(
                    "Salary structure name already exists");
        }

        return salaryStructureRepository.save(salaryStructure);
    }

    @Override
    public SalaryStructure getSalaryStructureById(UUID id) {

        return salaryStructureRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Salary structure not found"));
    }

    @Override
    public List<SalaryStructure> getAllSalaryStructures() {

        return salaryStructureRepository.findAll();
    }

    @Override
    public SalaryStructure updateSalaryStructure(
            UUID id,
            SalaryStructure salaryStructure) {

        SalaryStructure existingSalaryStructure =
                salaryStructureRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Salary structure not found"));

        existingSalaryStructure.setStructureName(
                salaryStructure.getStructureName());

        existingSalaryStructure.setBasicSalary(
                salaryStructure.getBasicSalary());

        existingSalaryStructure.setHra(
                salaryStructure.getHra());

        existingSalaryStructure.setSpecialAllowance(
                salaryStructure.getSpecialAllowance());

        existingSalaryStructure.setGrossSalary(
                salaryStructure.getGrossSalary());

        existingSalaryStructure.setActive(
                salaryStructure.getActive());

        return salaryStructureRepository.save(
                existingSalaryStructure);
    }

    @Override
    public void deleteSalaryStructure(UUID id) {

        SalaryStructure existingSalaryStructure =
                salaryStructureRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Salary structure not found"));

        salaryStructureRepository.delete(
                existingSalaryStructure);
    }
}