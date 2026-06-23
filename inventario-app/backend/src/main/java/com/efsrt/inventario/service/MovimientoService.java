package com.efsrt.inventario.service;

import com.efsrt.inventario.dto.request.MovimientoRequest;
import com.efsrt.inventario.dto.response.MovimientoResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface MovimientoService {
    MovimientoResponse registrar(MovimientoRequest request, String emailUsuario);
    Page<MovimientoResponse> listar(Pageable pageable);
    Page<MovimientoResponse> listarPorProducto(Long productoId, Pageable pageable);
}
