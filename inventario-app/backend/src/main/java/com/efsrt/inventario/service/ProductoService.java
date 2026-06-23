package com.efsrt.inventario.service;

import com.efsrt.inventario.dto.request.ProductoRequest;
import com.efsrt.inventario.dto.response.ProductoResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ProductoService {

    ProductoResponse crear(ProductoRequest request);

    ProductoResponse actualizar(Long id, ProductoRequest request);

    ProductoResponse obtenerPorId(Long id);

    Page<ProductoResponse> listar(String busqueda, Long categoriaId, Pageable pageable);

    void eliminar(Long id);  // eliminación lógica (activo = false)

    List<ProductoResponse> obtenerConStockBajo();
}
