package com.example.demo.leave.serviceimpl;

import java.util.UUID;

import org.springframework.stereotype.Service;

import com.example.demo.auth.entity.AppUser;
import com.example.demo.auth.repository.AppUserRepository;
import com.example.demo.leave.entity.LeaveBalance;
import com.example.demo.leave.repository.LeaveBalanceRepository;
import com.example.demo.leave.service.LeaveBalanceService;

@Service
public class LeaveBalanceServiceImpl
        implements LeaveBalanceService {

    private final LeaveBalanceRepository leaveBalanceRepository;
    private final AppUserRepository appUserRepository;

    public LeaveBalanceServiceImpl(
            LeaveBalanceRepository leaveBalanceRepository,
            AppUserRepository appUserRepository) {

        this.leaveBalanceRepository = leaveBalanceRepository;
        this.appUserRepository = appUserRepository;
    }

    @Override
    public LeaveBalance createLeaveBalance(UUID employeeId) {

        if (leaveBalanceRepository.existsByEmployeeId(employeeId)) {
            throw new RuntimeException(
                    "Leave balance already exists for employee");
        }

        LeaveBalance leaveBalance = new LeaveBalance();

        leaveBalance.setEmployeeId(employeeId);

        leaveBalance.setCasualLeaveAllocated(12);
        leaveBalance.setCasualLeaveBalance(12);

        leaveBalance.setSickLeaveAllocated(12);
        leaveBalance.setSickLeaveBalance(12);

        leaveBalance.setEarnedLeaveAllocated(15);
        leaveBalance.setEarnedLeaveBalance(15);

        return leaveBalanceRepository.save(leaveBalance);
    }

    @Override
    public LeaveBalance getLeaveBalance(UUID employeeId) {

        return leaveBalanceRepository
                .findByEmployeeId(employeeId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Leave balance not found"));
    }

    @Override
    public LeaveBalance updateLeaveBalance(
            UUID employeeId,
            LeaveBalance leaveBalance) {

        LeaveBalance existingBalance =
                leaveBalanceRepository
                        .findByEmployeeId(employeeId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Leave balance not found"));

        existingBalance.setCasualLeaveAllocated(
                leaveBalance.getCasualLeaveAllocated());

        existingBalance.setCasualLeaveBalance(
                leaveBalance.getCasualLeaveBalance());

        existingBalance.setSickLeaveAllocated(
                leaveBalance.getSickLeaveAllocated());

        existingBalance.setSickLeaveBalance(
                leaveBalance.getSickLeaveBalance());

        existingBalance.setEarnedLeaveAllocated(
                leaveBalance.getEarnedLeaveAllocated());

        existingBalance.setEarnedLeaveBalance(
                leaveBalance.getEarnedLeaveBalance());

        return leaveBalanceRepository.save(existingBalance);
    }

    @Override
    public LeaveBalance getMyLeaveBalance(String username) {

        AppUser appUser =
                appUserRepository.findByUsername(username)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found"));

        if (appUser.getEmployeeId() == null) {
            throw new RuntimeException(
                    "No employee is linked to this user");
        }

        return getLeaveBalance(appUser.getEmployeeId());
    }
}