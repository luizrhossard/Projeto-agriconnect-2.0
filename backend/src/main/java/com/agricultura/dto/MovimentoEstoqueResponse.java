package com.agricultura.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MovimentoEstoqueResponse {

    private Long id;
    private String tipo;
    private BigDecimal quantidade;
    private BigDecimal quantidadeAnterior;
    private BigDecimal quantidadeAtual;
    private String motivo;
    private String responsavel;
    private Long insumoId;
    private String insumoNome;
    private LocalDateTime createdAt;
}
