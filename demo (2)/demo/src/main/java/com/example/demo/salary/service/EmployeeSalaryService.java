package com.example.demo.salary.service;

import java.util.List;
import java.util.UUID;

import com.example.demo.salary.entity.EmployeeSalary;

public interface EmployeeSalaryService {

    EmployeeSalary assignSalary(
            EmployeeSalary employeeSalary);

    EmployeeSalary getSalaryById(UUID id);

    List<EmployeeSalary> getSalaryHistory(
            UUID employeeId);

    EmployeeSalary getActiveSalary(
            UUID employeeId);

    EmployeeSalary updateSalary(
            UUID id,
            EmployeeSalary employeeSalary);

    void deleteSalary(UUID id);
}