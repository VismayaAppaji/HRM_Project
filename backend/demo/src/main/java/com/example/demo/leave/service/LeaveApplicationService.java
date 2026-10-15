package com.example.demo.leave.service;

import java.util.List;
import java.util.UUID;

import com.example.demo.leave.entity.LeaveApplication;

public interface LeaveApplicationService {

    LeaveApplication applyLeave(LeaveApplication leaveApplication);

    List<LeaveApplication> getAllLeaves();

    LeaveApplication getLeaveById(UUID id);

    List<LeaveApplication> getLeavesByEmployee(UUID employeeId);

    List<LeaveApplication> getPendingLeaves();

    LeaveApplication approveLeave(UUID id);

    LeaveApplication rejectLeave(UUID id);
}