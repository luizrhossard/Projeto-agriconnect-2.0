package com.agricultura.dto;

import java.math.BigDecimal;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardResponse {
    private Long totalCulturas;
    private Long totalTarefas;
    private Long tarefasPendentes;
    private Long tarefasEmAndamento;
    private Long tarefasConcluidas;
    private List<CulturaResponse> ultimasCulturas;
    private List<TarefaResponse> tarefasPendentesList;
    private List<AtividadeRecenteResponse> atividadesRecentes;

    // Métricas agrícolas reais
    private BigDecimal produtividadeMedia; // ton/ha
    private BigDecimal variacaoProdutividade; // % vs safra anterior
    private BigDecimal eficienciaHidrica; // %
    private BigDecimal variacaoUsoAgua; // %
    private BigDecimal custoPorHectare; // R$
    private BigDecimal variacaoCusto; // %
    private BigDecimal areaColhida; // ha
    private BigDecimal variacaoAreaColhida; // %
}
