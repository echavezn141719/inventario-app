package com.efsrt.inventario.service;

import com.efsrt.inventario.dto.response.DashboardResponse;
import com.efsrt.inventario.dto.response.MovimientoMesResponse;
import com.efsrt.inventario.entity.MovimientoInventario.TipoMovimiento;
import com.efsrt.inventario.repository.CategoriaRepository;
import com.efsrt.inventario.repository.MovimientoInventarioRepository;
import com.efsrt.inventario.repository.ProductoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DashboardService {

    private final ProductoRepository productoRepository;
    private final MovimientoInventarioRepository movimientoRepository;
    private final CategoriaRepository categoriaRepository;

    private static final String[] MESES = {
            "Ene","Feb","Mar","Abr","May","Jun",
            "Jul","Ago","Sep","Oct","Nov","Dic"
    };

    public List<MovimientoMesResponse> obtenerResumenAnual() {
        int anio = LocalDate.now().getYear();
        List<Object[]> rows = movimientoRepository.resumenPorMes(anio);
        return rows.stream().map(r -> new MovimientoMesResponse(
                MESES[((Number) r[0]).intValue() - 1],
                ((Number) r[1]).longValue(),
                ((Number) r[2]).longValue()
        )).toList();
    }
    public DashboardResponse obtenerMetricas() {
        LocalDateTime inicioMes = LocalDate.now().withDayOfMonth(1).atStartOfDay();

        return DashboardResponse.builder()
                .totalProductos(productoRepository.countByActivoTrue())
                .productosStockBajo(productoRepository.countProductosStockBajo())
                .entradasMes(movimientoRepository.sumCantidadPorTipoDesde(TipoMovimiento.ENTRADA, inicioMes))
                .salidasMes(movimientoRepository.sumCantidadPorTipoDesde(TipoMovimiento.SALIDA, inicioMes))
                .totalCategorias(categoriaRepository.count())
                .build();
    }
}
