package com.efsrt.inventario.dto.response;

import lombok.Builder;
import lombok.Data;

@Data @Builder
public class DashboardResponse {
    private long totalProductos;
    private long productosStockBajo;
    private long entradasMes;
    private long salidasMes;
    private long totalCategorias;
}
