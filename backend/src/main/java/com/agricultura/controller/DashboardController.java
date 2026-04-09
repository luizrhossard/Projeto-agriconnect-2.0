package com.agricultura.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.agricultura.dto.*;
import com.agricultura.service.AuthService;
import com.agricultura.service.DashboardService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;
    private final AuthService authService;

    @GetMapping("/resumo")
    public ResponseEntity<DashboardResponse> getResumo() {
        Long userId = authService.getCurrentUser().getId();
        return ResponseEntity.ok(dashboardService.getResumo(userId));
    }
}
