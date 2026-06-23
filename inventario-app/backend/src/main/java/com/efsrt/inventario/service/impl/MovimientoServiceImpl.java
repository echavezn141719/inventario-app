package com.efsrt.inventario.service.impl;

import com.efsrt.inventario.dto.request.MovimientoRequest;
import com.efsrt.inventario.dto.response.MovimientoResponse;
import com.efsrt.inventario.entity.MovimientoInventario;
import com.efsrt.inventario.entity.MovimientoInventario.TipoMovimiento;
import com.efsrt.inventario.entity.Producto;
import com.efsrt.inventario.entity.Usuario;
import com.efsrt.inventario.exception.BusinessException;
import com.efsrt.inventario.exception.ResourceNotFoundException;
import com.efsrt.inventario.repository.MovimientoInventarioRepository;
import com.efsrt.inventario.repository.ProductoRepository;
import com.efsrt.inventario.repository.UsuarioRepository;
import com.efsrt.inventario.service.MovimientoService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MovimientoServiceImpl implements MovimientoService {

    private final MovimientoInventarioRepository movimientoRepository;
    private final ProductoRepository productoRepository;
    private final UsuarioRepository usuarioRepository;

    @Override
    @Transactional
    public MovimientoResponse registrar(MovimientoRequest request, String emailUsuario) {
        Producto producto = productoRepository.findById(request.getProductoId())
                .orElseThrow(() -> new ResourceNotFoundException("Producto", "id", request.getProductoId()));

        Usuario usuario = usuarioRepository.findByEmail(emailUsuario)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario", "email", emailUsuario));

        int stockAnterior = producto.getStockActual();
        int stockPosterior;

        if (request.getTipo() == TipoMovimiento.ENTRADA) {
            stockPosterior = stockAnterior + request.getCantidad();
        } else {
            // Validar que haya stock suficiente para la salida
            if (stockAnterior < request.getCantidad()) {
                throw new BusinessException(
                    "Stock insuficiente. Stock actual: " + stockAnterior +
                    ", cantidad solicitada: " + request.getCantidad());
            }
            stockPosterior = stockAnterior - request.getCantidad();
        }

        // Actualizar stock del producto
        producto.setStockActual(stockPosterior);
        productoRepository.save(producto);

        // Registrar el movimiento
        MovimientoInventario movimiento = MovimientoInventario.builder()
                .producto(producto)
                .tipo(request.getTipo())
                .cantidad(request.getCantidad())
                .stockAnterior(stockAnterior)
                .stockPosterior(stockPosterior)
                .motivo(request.getMotivo())
                .usuario(usuario)
                .build();

        return toResponse(movimientoRepository.save(movimiento));
    }

    @Override
    public Page<MovimientoResponse> listar(Pageable pageable) {
        return movimientoRepository.findAll(pageable).map(this::toResponse);
    }

    @Override
    public Page<MovimientoResponse> listarPorProducto(Long productoId, Pageable pageable) {
        return movimientoRepository.findByProductoId(productoId, pageable).map(this::toResponse);
    }

    private MovimientoResponse toResponse(MovimientoInventario m) {
        return MovimientoResponse.builder()
                .id(m.getId())
                .productoId(m.getProducto().getId())
                .productoNombre(m.getProducto().getNombre())
                .productoCodigo(m.getProducto().getCodigo())
                .tipo(m.getTipo())
                .cantidad(m.getCantidad())
                .stockAnterior(m.getStockAnterior())
                .stockPosterior(m.getStockPosterior())
                .motivo(m.getMotivo())
                .usuarioNombre(m.getUsuario().getNombre())
                .fechaMovimiento(m.getFechaMovimiento())
                .build();
    }
}
