package com.agricultura.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AtividadeRecenteResponse {
    private String tipo; // CULTURA, TAREFA, COLHEITA, IRRIGACAO, etc.
    private String titulo;
    private String descricao;
    private String culturaNome;
    private String area;
    private String data;
    private String icone;
    private String status;
    private String iconeTipo; // seedling, droplet, flask, etc.
    private String corFundo; // bg-emerald-100, bg-sky-100, etc.
}
