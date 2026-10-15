package com.example.demo.leave.entity;

import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "leave_balances")
public class LeaveBalance {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private UUID employeeId;

    @Column(nullable = false)
    private Integer casualLeaveAllocated = 12;

    @Column(nullable = false)
    private Integer casualLeaveBalance = 12;

    @Column(nullable = false)
    private Integer sickLeaveAllocated = 12;

    @Column(nullable = false)
    private Integer sickLeaveBalance = 12;

    @Column(nullable = false)
    private Integer earnedLeaveAllocated = 15;

    @Column(nullable = false)
    private Integer earnedLeaveBalance = 15;

    public LeaveBalance() {
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public UUID getEmployeeId() {
        return employeeId;
    }

    public void setEmployeeId(UUID employeeId) {
        this.employeeId = employeeId;
    }

    public Integer getCasualLeaveAllocated() {
        return casualLeaveAllocated;
    }

    public void setCasualLeaveAllocated(Integer casualLeaveAllocated) {
        this.casualLeaveAllocated = casualLeaveAllocated;
    }

    public Integer getCasualLeaveBalance() {
        return casualLeaveBalance;
    }

    public void setCasualLeaveBalance(Integer casualLeaveBalance) {
        this.casualLeaveBalance = casualLeaveBalance;
    }

    public Integer getSickLeaveAllocated() {
        return sickLeaveAllocated;
    }

    public void setSickLeaveAllocated(Integer sickLeaveAllocated) {
        this.sickLeaveAllocated = sickLeaveAllocated;
    }

    public Integer getSickLeaveBalance() {
        return sickLeaveBalance;
    }

    public void setSickLeaveBalance(Integer sickLeaveBalance) {
        this.sickLeaveBalance = sickLeaveBalance;
    }

    public Integer getEarnedLeaveAllocated() {
        return earnedLeaveAllocated;
    }

    public void setEarnedLeaveAllocated(Integer earnedLeaveAllocated) {
        this.earnedLeaveAllocated = earnedLeaveAllocated;
    }

    public Integer getEarnedLeaveBalance() {
        return earnedLeaveBalance;
    }

    public void setEarnedLeaveBalance(Integer earnedLeaveBalance) {
        this.earnedLeaveBalance = earnedLeaveBalance;
    }
}