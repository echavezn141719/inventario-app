package com.efsrt.inventario.dto.response;

import com.efsrt.inventario.entity.MovimientoInventario.TipoMovimiento;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class MovimientoResponse {
    private Long id;
    private Long productoId;
    private String productoNombre;
    private String productoCodigo;
    private TipoMovimiento tipo;
    private Integer cantidad;
    private Integer stockAnterior;
    private Integer stockPosterior;
    private String motivo;
    private String usuarioNombre;
    private LocalDateTime fechaMovimiento;
}
