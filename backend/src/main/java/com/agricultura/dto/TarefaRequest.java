package com.agricultura.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import lombok.Data;

@Data
public class TarefaRequest {
    @NotBlank(message = "Título é obrigatório")
    private String titulo;

    private String descricao;

    private String prioridade;

    private String status;

    @NotNull(message = "Data de vencimento é obrigatória") private LocalDate dataVencimento;

    private Long culturaId;
}
