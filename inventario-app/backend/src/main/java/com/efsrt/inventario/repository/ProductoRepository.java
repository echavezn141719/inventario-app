package com.efsrt.inventario.repository;

import com.efsrt.inventario.entity.Producto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductoRepository extends JpaRepository<Producto, Long> {

    Optional<Producto> findByCodigo(String codigo);

    boolean existsByCodigo(String codigo);

    // Busca activos con paginación y filtro por nombre o código
    @Query("""
        SELECT p FROM Producto p
        WHERE p.activo = true
          AND (:busqueda IS NULL OR
               LOWER(p.nombre) LIKE LOWER(CONCAT('%', :busqueda, '%')) OR
               LOWER(p.codigo) LIKE LOWER(CONCAT('%', :busqueda, '%')))
          AND (:categoriaId IS NULL OR p.categoria.id = :categoriaId)
        """)
    Page<Producto> buscar(@Param("busqueda") String busqueda,
                          @Param("categoriaId") Long categoriaId,
                          Pageable pageable);

    // Productos con stock por debajo del mínimo (alertas)
    @Query("SELECT p FROM Producto p WHERE p.activo = true AND p.stockActual <= p.stockMinimo")
    List<Producto> findProductosConStockBajo();

    // Conteo para dashboard
    long countByActivoTrue();

    @Query("SELECT COUNT(p) FROM Producto p WHERE p.activo = true AND p.stockActual <= p.stockMinimo")
    long countProductosStockBajo();
}
