package com.example.demo.salary.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.salary.entity.EmployeeSalary;

public interface EmployeeSalaryRepository
        extends JpaRepository<EmployeeSalary, UUID> {

    List<EmployeeSalary> findByEmployeeId(UUID employeeId);

    List<EmployeeSalary> findByEmployeeIdAndActiveTrue(UUID employeeId);
}
