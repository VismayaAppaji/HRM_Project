package com.example.demo.dashboard.dto;

public class DashboardResponse {

    private long totalEmployeesProcessed;
    private long pendingPayroll;
    private long payslipsSentSuccessfully;
    private long failedEmailDeliveries;
    private LeaveBalanceSummary leaveBalanceSummary;

    public DashboardResponse() {
    }

    public DashboardResponse(
            long totalEmployeesProcessed,
            long pendingPayroll,
            long payslipsSentSuccessfully,
            long failedEmailDeliveries,
            LeaveBalanceSummary leaveBalanceSummary) {

        this.totalEmployeesProcessed = totalEmployeesProcessed;
        this.pendingPayroll = pendingPayroll;
        this.payslipsSentSuccessfully = payslipsSentSuccessfully;
        this.failedEmailDeliveries = failedEmailDeliveries;
        this.leaveBalanceSummary = leaveBalanceSummary;
    }

    public long getTotalEmployeesProcessed() {
        return totalEmployeesProcessed;
    }

    public void setTotalEmployeesProcessed(long totalEmployeesProcessed) {
        this.totalEmployeesProcessed = totalEmployeesProcessed;
    }

    public long getPendingPayroll() {
        return pendingPayroll;
    }

    public void setPendingPayroll(long pendingPayroll) {
        this.pendingPayroll = pendingPayroll;
    }

    public long getPayslipsSentSuccessfully() {
        return payslipsSentSuccessfully;
    }

    public void setPayslipsSentSuccessfully(long payslipsSentSuccessfully) {
        this.payslipsSentSuccessfully = payslipsSentSuccessfully;
    }

    public long getFailedEmailDeliveries() {
        return failedEmailDeliveries;
    }

    public void setFailedEmailDeliveries(long failedEmailDeliveries) {
        this.failedEmailDeliveries = failedEmailDeliveries;
    }

    public LeaveBalanceSummary getLeaveBalanceSummary() {
        return leaveBalanceSummary;
    }

    public void setLeaveBalanceSummary(LeaveBalanceSummary leaveBalanceSummary) {
        this.leaveBalanceSummary = leaveBalanceSummary;
    }

    public static class LeaveBalanceSummary {

        private long totalCasualLeaveBalance;
        private long totalSickLeaveBalance;
        private long totalEarnedLeaveBalance;

        public LeaveBalanceSummary() {
        }

        public LeaveBalanceSummary(
                long totalCasualLeaveBalance,
                long totalSickLeaveBalance,
                long totalEarnedLeaveBalance) {

            this.totalCasualLeaveBalance = totalCasualLeaveBalance;
            this.totalSickLeaveBalance = totalSickLeaveBalance;
            this.totalEarnedLeaveBalance = totalEarnedLeaveBalance;
        }

        public long getTotalCasualLeaveBalance() {
            return totalCasualLeaveBalance;
        }

        public void setTotalCasualLeaveBalance(long totalCasualLeaveBalance) {
            this.totalCasualLeaveBalance = totalCasualLeaveBalance;
        }

        public long getTotalSickLeaveBalance() {
            return totalSickLeaveBalance;
        }

        public void setTotalSickLeaveBalance(long totalSickLeaveBalance) {
            this.totalSickLeaveBalance = totalSickLeaveBalance;
        }

        public long getTotalEarnedLeaveBalance() {
            return totalEarnedLeaveBalance;
        }

        public void setTotalEarnedLeaveBalance(long totalEarnedLeaveBalance) {
            this.totalEarnedLeaveBalance = totalEarnedLeaveBalance;
        }
    }
}