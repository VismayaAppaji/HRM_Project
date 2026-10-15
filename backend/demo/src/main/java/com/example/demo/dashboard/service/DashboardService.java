package com.example.demo.dashboard.service;

import com.example.demo.dashboard.dto.DashboardResponse;

public interface DashboardService {

    DashboardResponse getDashboard(String payPeriod);
}