package com.efsrt.inventario.controller;

import com.efsrt.inventario.dto.request.MovimientoRequest;
import com.efsrt.inventario.dto.response.ApiResponse;
import com.efsrt.inventario.dto.response.MovimientoResponse;
import com.efsrt.inventario.service.MovimientoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/movimientos")
@RequiredArgsConstructor
@Tag(name = "Movimientos", description = "Registro de entradas y salidas de inventario")
@SecurityRequirement(name = "bearerAuth")
public class MovimientoController {

    private final MovimientoService movimientoService;

    @GetMapping
    @Operation(summary = "Listar movimientos paginados")
    public ResponseEntity<ApiResponse<Page<MovimientoResponse>>> listar(
            @PageableDefault(size = 20, sort = "fechaMovimiento", direction = Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.ok(movimientoService.listar(pageable)));
    }

    @GetMapping("/producto/{productoId}")
    @Operation(summary = "Listar movimientos por producto")
    public ResponseEntity<ApiResponse<Page<MovimientoResponse>>> listarPorProducto(
            @PathVariable Long productoId,
            @PageableDefault(size = 20, sort = "fechaMovimiento", direction = Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.ok(
                movimientoService.listarPorProducto(productoId, pageable)));
    }

    @PostMapping
    @Operation(summary = "Registrar entrada o salida de inventario")
    public ResponseEntity<ApiResponse<MovimientoResponse>> registrar(
            @Valid @RequestBody MovimientoRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Movimiento registrado",
                        movimientoService.registrar(request, userDetails.getUsername())));
    }
}
