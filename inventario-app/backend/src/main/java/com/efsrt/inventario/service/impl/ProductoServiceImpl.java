package com.efsrt.inventario.service.impl;

import com.efsrt.inventario.dto.request.ProductoRequest;
import com.efsrt.inventario.dto.response.ProductoResponse;
import com.efsrt.inventario.entity.Categoria;
import com.efsrt.inventario.entity.Producto;
import com.efsrt.inventario.exception.BusinessException;
import com.efsrt.inventario.exception.ResourceNotFoundException;
import com.efsrt.inventario.repository.CategoriaRepository;
import com.efsrt.inventario.repository.ProductoRepository;
import com.efsrt.inventario.service.ProductoService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ProductoServiceImpl implements ProductoService {

    private final ProductoRepository productoRepository;
    private final CategoriaRepository categoriaRepository;

    @Override
    @Transactional
    public ProductoResponse crear(ProductoRequest request) {
        if (productoRepository.existsByCodigo(request.getCodigo())) {
            throw new BusinessException("Ya existe un producto con el código: " + request.getCodigo());
        }
        Categoria categoria = obtenerCategoria(request.getCategoriaId());
        Producto producto = Producto.builder()
                .codigo(request.getCodigo())
                .nombre(request.getNombre())
                .descripcion(request.getDescripcion())
                .ubicacion(request.getUbicacion())
                .imagenUrl(request.getImagenUrl())
                .stockActual(request.getStockActual())
                .stockMinimo(request.getStockMinimo())
                .stockMaximo(request.getStockMaximo())
                .categoria(categoria)
                .build();
        return toResponse(productoRepository.save(producto));
    }

    @Override
    @Transactional
    public ProductoResponse actualizar(Long id, ProductoRequest request) {
        Producto producto = obtenerProducto(id);
        // Solo valida código si cambió
        if (!producto.getCodigo().equals(request.getCodigo()) &&
                productoRepository.existsByCodigo(request.getCodigo())) {
            throw new BusinessException("Ya existe un producto con el código: " + request.getCodigo());
        }
        Categoria categoria = obtenerCategoria(request.getCategoriaId());
        producto.setCodigo(request.getCodigo());
        producto.setNombre(request.getNombre());
        producto.setDescripcion(request.getDescripcion());
        producto.setUbicacion(request.getUbicacion());
        producto.setImagenUrl(request.getImagenUrl());
        producto.setStockActual(request.getStockActual());
        producto.setStockMinimo(request.getStockMinimo());
        producto.setStockMaximo(request.getStockMaximo());
        producto.setCategoria(categoria);
        return toResponse(productoRepository.save(producto));
    }

    @Override
    public ProductoResponse obtenerPorId(Long id) {
        return toResponse(obtenerProducto(id));
    }

    @Override
    public Page<ProductoResponse> listar(String busqueda, Long categoriaId, Pageable pageable) {
        return productoRepository.buscar(busqueda, categoriaId, pageable).map(this::toResponse);
    }

    @Override
    @Transactional
    public void eliminar(Long id) {
        Producto producto = obtenerProducto(id);
        producto.setActivo(false);  // eliminación lógica
        productoRepository.save(producto);
    }

    @Override
    public List<ProductoResponse> obtenerConStockBajo() {
        return productoRepository.findProductosConStockBajo()
                .stream().map(this::toResponse).toList();
    }

    // ===== HELPERS PRIVADOS =====

    private Producto obtenerProducto(Long id) {
        return productoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Producto", "id", id));
    }

    private Categoria obtenerCategoria(Long id) {
        return categoriaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Categoría", "id", id));
    }

    private ProductoResponse toResponse(Producto p) {
        return ProductoResponse.builder()
                .id(p.getId())
                .codigo(p.getCodigo())
                .nombre(p.getNombre())
                .descripcion(p.getDescripcion())
                .ubicacion(p.getUbicacion())
                .imagenUrl(p.getImagenUrl())
                .stockActual(p.getStockActual())
                .stockMinimo(p.getStockMinimo())
                .stockMaximo(p.getStockMaximo())
                .categoriaId(p.getCategoria().getId())
                .categoriaNombre(p.getCategoria().getNombre())
                .activo(p.getActivo())
                .stockBajo(p.tieneStockBajo())
                .createdAt(p.getCreatedAt())
                .build();
    }
}
