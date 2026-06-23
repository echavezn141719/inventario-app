package com.efsrt.inventario.dto.request;

import com.efsrt.inventario.entity.MovimientoInventario.TipoMovimiento;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class MovimientoRequest {

    @NotNull(message = "El producto es obligatorio")
    private Long productoId;

    @NotNull(message = "El tipo es obligatorio (ENTRADA o SALIDA)")
    private TipoMovimiento tipo;

    @NotNull
    @Min(value = 1, message = "La cantidad debe ser al menos 1")
    private Integer cantidad;

    private String motivo;
}
