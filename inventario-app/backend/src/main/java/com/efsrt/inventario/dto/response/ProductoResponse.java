package com.efsrt.inventario.dto.response;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data @Builder
public class ProductoResponse {
    private Long id;
    private String codigo;
    private String nombre;
    private String descripcion;
    private String ubicacion;
    private String imagenUrl;
    private Integer stockActual;
    private Integer stockMinimo;
    private Integer stockMaximo;
    private String unidadMedida;
    private Long categoriaId;
    private String categoriaNombre;
    private Boolean activo;
    private Boolean stockBajo;
    private LocalDateTime createdAt;
}
