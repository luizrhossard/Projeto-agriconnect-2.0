package com.agricultura.dto;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MovimentoEstoqueRequest {

    @NotNull(message = "Insumo ID é obrigatório") private Long insumoId;

    @NotBlank(message = "Tipo é obrigatório")
    @Pattern(regexp = "^(ENTRADA|SAIDA)$", message = "Tipo deve ser ENTRADA ou SAIDA")
    private String tipo;

    @NotNull(message = "Quantidade é obrigatória") @DecimalMin(value = "0.01", message = "Quantidade deve ser maior que zero")
    @Digits(integer = 8, fraction = 2, message = "Quantidade inválida")
    private BigDecimal quantidade;

    @Size(max = 255, message = "Motivo deve ter no máximo 255 caracteres")
    private String motivo;

    @Size(max = 255, message = "Responsável deve ter no máximo 255 caracteres")
    private String responsavel;
}
