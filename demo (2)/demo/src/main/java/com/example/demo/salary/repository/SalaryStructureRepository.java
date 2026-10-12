package com.example.demo.salary.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.salary.entity.SalaryStructure;

public interface SalaryStructureRepository
        extends JpaRepository<SalaryStructure, UUID> {

    boolean existsByStructureName(String structureName);
}