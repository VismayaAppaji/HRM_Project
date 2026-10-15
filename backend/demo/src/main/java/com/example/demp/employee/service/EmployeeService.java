package com.example.demp.employee.service;

import java.util.List;
import java.util.UUID;

import com.example.demo.employee.entity.Employee;

public interface EmployeeService {

    Employee createEmployee(Employee employee);

    Employee getEmployeeById(UUID id);

    List<Employee> getAllEmployees();

    Employee updateEmployee(UUID id, Employee employee);

    void deleteEmployee(UUID id);

    Employee getEmployeeByUsername(String username);
}