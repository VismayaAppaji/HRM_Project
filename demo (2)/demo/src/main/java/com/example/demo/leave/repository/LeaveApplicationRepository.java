package com.example.demo.leave.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.leave.entity.LeaveApplication;

public interface LeaveApplicationRepository
        extends JpaRepository<LeaveApplication, UUID> {

    List<LeaveApplication> findByEmployeeId(UUID employeeId);

    List<LeaveApplication> findByEmployeeIdAndStatus(
            UUID employeeId, String status);

    List<LeaveApplication> findByStatus(String status);
}