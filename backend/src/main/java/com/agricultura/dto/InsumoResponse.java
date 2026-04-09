package com.agricultura.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InsumoResponse {

    private Long id;
    private String nome;
    private String tipo;
    private BigDecimal quantidade;
    private String unidade;
    private BigDecimal precoUnitario;
    private LocalDate dataValidade;
    private String fornecedor;
    private BigDecimal estoqueMinimo;
    private Boolean ativo;
    private Boolean estoqueBaixo;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
