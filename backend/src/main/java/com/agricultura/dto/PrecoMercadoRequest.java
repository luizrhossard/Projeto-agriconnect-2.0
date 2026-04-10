package com.agricultura.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.math.BigDecimal;
import lombok.Data;

@Data
public class PrecoMercadoRequest {
    @NotBlank(message = "Produto é obrigatório")
    private String produto;

    @NotNull(message = "Preço é obrigatório") @Positive(message = "Preço deve ser positivo") private BigDecimal preco;

    private String unidade;
    private BigDecimal variacao;
}
