package com.agricultura.dto;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InsumoRequest {

    @NotBlank(message = "Nome é obrigatório")
    @Size(max = 255, message = "Nome deve ter no máximo 255 caracteres")
    private String nome;

    @NotBlank(message = "Tipo é obrigatório")
    @Size(max = 100, message = "Tipo deve ter no máximo 100 caracteres")
    @Builder.Default
    private String tipo = "FERTILIZANTE";

    @NotNull(message = "Quantidade é obrigatória") @DecimalMin(value = "0.00", message = "Quantidade deve ser positiva")
    @Digits(integer = 8, fraction = 2, message = "Quantidade inválida")
    private BigDecimal quantidade;

    @NotBlank(message = "Unidade é obrigatória")
    @Size(max = 20, message = "Unidade deve ter no máximo 20 caracteres")
    @Builder.Default
    private String unidade = "KG";

    @NotNull(message = "Preço unitário é obrigatório") @DecimalMin(value = "0.00", message = "Preço deve ser positivo")
    @Digits(integer = 8, fraction = 2, message = "Preço inválido")
    private BigDecimal precoUnitario;

    private LocalDate dataValidade;

    @Size(max = 255, message = "Fornecedor deve ter no máximo 255 caracteres")
    private String fornecedor;

    @DecimalMin(value = "0.00", message = "Estoque mínimo deve ser positivo")
    @Digits(integer = 8, fraction = 2, message = "Estoque mínimo inválido")
    private BigDecimal estoqueMinimo;
}
