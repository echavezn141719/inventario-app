package com.efsrt.inventario.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class ProductoRequest {

    @NotBlank(message = "El código es obligatorio")
    @Size(max = 50, message = "El código no puede superar 50 caracteres")
    private String codigo;

    @NotBlank(message = "El nombre es obligatorio")
    @Size(max = 200, message = "El nombre no puede superar 200 caracteres")
    private String nombre;

    @Size(max = 500)
    private String descripcion;

    @Size(max = 300)
    private String ubicacion;

    @Size(max = 500)
    private String imagenUrl;

    @NotNull
    @Min(value = 0, message = "El stock no puede ser negativo")
    private Integer stockActual;

    @NotNull
    @Min(value = 0)
    private Integer stockMinimo;

    private Integer stockMaximo;

    @Size(max = 100)
    private String unidadMedida;

    @NotNull(message = "La categoría es obligatoria")
    private Long categoriaId;
}
