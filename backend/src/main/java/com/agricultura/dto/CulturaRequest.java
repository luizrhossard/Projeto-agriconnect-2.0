package com.agricultura.dto;

import java.time.LocalDate;

import com.agricultura.domain.StatusCultura;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class CulturaRequest {
    @NotBlank(message = "O nome da cultura é obrigatório")
    private String nome;

    @NotNull(message = "A área é obrigatória") @Positive(message = "A área deve ser um valor positivo") private Double area;

    private StatusCultura status;

    @NotNull(message = "A data de plantio é obrigatória") private LocalDate dataPlantio;

    private LocalDate previsaoColheita;
    private String icone;
    private Integer progress;
}
