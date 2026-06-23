package com.efsrt.inventario.controller;

import com.efsrt.inventario.dto.response.ApiResponse;
import com.efsrt.inventario.dto.response.DashboardResponse;
import com.efsrt.inventario.dto.response.MovimientoMesResponse;
import com.efsrt.inventario.service.DashboardService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/dashboard")
@RequiredArgsConstructor
@Tag(name = "Dashboard", description = "Métricas y resumen del inventario")
@SecurityRequirement(name = "bearerAuth")
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/resumen-anual")
    @Operation(summary = "Movimientos agrupados por mes del año actual")
    public ResponseEntity<ApiResponse<List<MovimientoMesResponse>>> resumenAnual() {
        return ResponseEntity.ok(ApiResponse.ok(dashboardService.obtenerResumenAnual()));
    }
    @GetMapping
    @Operation(summary = "Obtener métricas del dashboard")
    public ResponseEntity<ApiResponse<DashboardResponse>> obtenerMetricas() {
        return ResponseEntity.ok(ApiResponse.ok(dashboardService.obtenerMetricas()));
    }
}
