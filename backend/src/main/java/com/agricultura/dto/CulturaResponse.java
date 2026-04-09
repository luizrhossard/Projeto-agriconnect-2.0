package com.agricultura.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CulturaResponse {
    private Long id;
    private String nome;
    private BigDecimal area;
    private String status;
    private LocalDate dataPlantio;
    private LocalDate previsaoColheita;
    private String icone;
    private Integer progress;
    private Long userId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
