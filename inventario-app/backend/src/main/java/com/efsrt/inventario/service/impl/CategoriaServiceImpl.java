package com.efsrt.inventario.service.impl;

import com.efsrt.inventario.dto.request.CategoriaRequest;
import com.efsrt.inventario.dto.response.CategoriaResponse;
import com.efsrt.inventario.entity.Categoria;
import com.efsrt.inventario.exception.BusinessException;
import com.efsrt.inventario.exception.ResourceNotFoundException;
import com.efsrt.inventario.repository.CategoriaRepository;
import com.efsrt.inventario.service.CategoriaService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CategoriaServiceImpl implements CategoriaService {

    private final CategoriaRepository categoriaRepository;

    @Override
    public List<CategoriaResponse> listar() {
        return categoriaRepository.findByActivoTrue()
                .stream().map(this::toResponse).toList();
    }

    @Override
    public CategoriaResponse obtenerPorId(Long id) {
        return toResponse(obtenerCategoria(id));
    }

    @Override
    @Transactional
    public CategoriaResponse crear(CategoriaRequest request) {
        if (categoriaRepository.existsByNombreIgnoreCase(request.getNombre())) {
            throw new BusinessException("Ya existe una categoría con el nombre: " + request.getNombre());
        }
        Categoria categoria = Categoria.builder()
                .nombre(request.getNombre())
                .descripcion(request.getDescripcion())
                .build();
        return toResponse(categoriaRepository.save(categoria));
    }

    @Override
    @Transactional
    public CategoriaResponse actualizar(Long id, CategoriaRequest request) {
        Categoria categoria = obtenerCategoria(id);
        if (!categoria.getNombre().equalsIgnoreCase(request.getNombre()) &&
                categoriaRepository.existsByNombreIgnoreCase(request.getNombre())) {
            throw new BusinessException("Ya existe una categoría con el nombre: " + request.getNombre());
        }
        categoria.setNombre(request.getNombre());
        categoria.setDescripcion(request.getDescripcion());
        return toResponse(categoriaRepository.save(categoria));
    }

    @Override
    @Transactional
    public void eliminar(Long id) {
        Categoria categoria = obtenerCategoria(id);
        // Verificar que no tenga productos activos
        boolean tieneProductos = categoria.getProductos() != null &&
                categoria.getProductos().stream().anyMatch(p -> Boolean.TRUE.equals(p.getActivo()));
        if (tieneProductos) {
            throw new BusinessException("No se puede eliminar la categoría porque tiene productos activos asociados");
        }
        categoria.setActivo(false);
        categoriaRepository.save(categoria);
    }

    private Categoria obtenerCategoria(Long id) {
        return categoriaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Categoría", "id", id));
    }

    private CategoriaResponse toResponse(Categoria c) {
        return CategoriaResponse.builder()
                .id(c.getId())
                .nombre(c.getNombre())
                .descripcion(c.getDescripcion())
                .activo(c.getActivo())
                .createdAt(c.getCreatedAt())
                .build();
    }
}
