package com.example.demo.employee.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.employee.entity.Employee;

public interface EmployeeRepository extends JpaRepository<Employee, UUID> {

    boolean existsByEmployeeCode(String employeeCode);

    boolean existsByEmail(String email);
}