package com.example.demo.salary.serviceimpl;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.example.demo.salary.entity.EmployeeSalary;
import com.example.demo.salary.repository.EmployeeSalaryRepository;
import com.example.demo.salary.service.EmployeeSalaryService;

@Service
public class EmployeeSalaryServiceImpl
        implements EmployeeSalaryService {

    private final EmployeeSalaryRepository employeeSalaryRepository;

    public EmployeeSalaryServiceImpl(
            EmployeeSalaryRepository employeeSalaryRepository) {

        this.employeeSalaryRepository = employeeSalaryRepository;
    }

    @Override
    public EmployeeSalary assignSalary(
            EmployeeSalary employeeSalary) {

        return employeeSalaryRepository.save(employeeSalary);
    }

    @Override
    public EmployeeSalary getSalaryById(UUID id) {

        return employeeSalaryRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Employee salary not found"));
    }

    @Override
    public List<EmployeeSalary> getSalaryHistory(
            UUID employeeId) {

        return employeeSalaryRepository
                .findByEmployeeId(employeeId);
    }

    @Override
    public EmployeeSalary getActiveSalary(
            UUID employeeId) {

        List<EmployeeSalary> salaries =
                employeeSalaryRepository
                        .findByEmployeeIdAndActiveTrue(employeeId);

        if (salaries.isEmpty()) {
            throw new RuntimeException(
                    "Active salary not found for employee");
        }

        return salaries.get(0);
    }

    @Override
    public EmployeeSalary updateSalary(
            UUID id,
            EmployeeSalary employeeSalary) {

        EmployeeSalary existingSalary =
                employeeSalaryRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Employee salary not found"));

        existingSalary.setEmployeeId(
                employeeSalary.getEmployeeId());

        existingSalary.setSalaryStructureId(
                employeeSalary.getSalaryStructureId());

        existingSalary.setBasicSalary(
                employeeSalary.getBasicSalary());

        existingSalary.setHra(
                employeeSalary.getHra());

        existingSalary.setSpecialAllowance(
                employeeSalary.getSpecialAllowance());

        existingSalary.setGrossSalary(
                employeeSalary.getGrossSalary());

        existingSalary.setEffectiveFrom(
                employeeSalary.getEffectiveFrom());

        existingSalary.setEffectiveTo(
                employeeSalary.getEffectiveTo());

        existingSalary.setActive(
                employeeSalary.getActive());

        return employeeSalaryRepository.save(existingSalary);
    }

    @Override
    public void deleteSalary(UUID id) {

        EmployeeSalary existingSalary =
                employeeSalaryRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Employee salary not found"));

        employeeSalaryRepository.delete(existingSalary);
    }
}