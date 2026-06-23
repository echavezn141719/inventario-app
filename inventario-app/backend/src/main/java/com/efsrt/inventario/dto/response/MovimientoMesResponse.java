package com.efsrt.inventario.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class MovimientoMesResponse {
    private String mes;
    private Long entradas;
    private Long salidas;
}
