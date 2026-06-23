package com.efsrt.inventario.repository;

import com.efsrt.inventario.entity.MovimientoInventario;
import com.efsrt.inventario.entity.MovimientoInventario.TipoMovimiento;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface MovimientoInventarioRepository extends JpaRepository<MovimientoInventario, Long> {

    Page<MovimientoInventario> findByProductoId(Long productoId, Pageable pageable);

    @Query("""
    SELECT MONTH(m.fechaMovimiento) as mes,
           SUM(CASE WHEN m.tipo = 'ENTRADA' THEN m.cantidad ELSE 0 END) as entradas,
           SUM(CASE WHEN m.tipo = 'SALIDA' THEN m.cantidad ELSE 0 END) as salidas
    FROM MovimientoInventario m
    WHERE YEAR(m.fechaMovimiento) = :anio
    GROUP BY MONTH(m.fechaMovimiento)
    ORDER BY MONTH(m.fechaMovimiento)
    """)
    List<Object[]> resumenPorMes(@Param("anio") int anio);

    @Query("""
        SELECT m FROM MovimientoInventario m
        WHERE (:productoId IS NULL OR m.producto.id = :productoId)
          AND (:tipo IS NULL OR m.tipo = :tipo)
          AND m.fechaMovimiento BETWEEN :desde AND :hasta
        ORDER BY m.fechaMovimiento DESC
        """)
    List<MovimientoInventario> filtrar(@Param("productoId") Long productoId,
                                       @Param("tipo") TipoMovimiento tipo,
                                       @Param("desde") LocalDateTime desde,
                                       @Param("hasta") LocalDateTime hasta);

    // Total entradas/salidas del mes para dashboard
    @Query("""
        SELECT COALESCE(SUM(m.cantidad), 0)
        FROM MovimientoInventario m
        WHERE m.tipo = :tipo
          AND m.fechaMovimiento >= :desde
        """)
    Long sumCantidadPorTipoDesde(@Param("tipo") TipoMovimiento tipo,
                                  @Param("desde") LocalDateTime desde);
}
