package com.agricultura.domain;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "cultura")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Cultura {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    public void setId(Long id) {
        this.id = id;
    }

    @Column(nullable = false, length = 255)
    private String nome;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal area;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    @Builder.Default
    private StatusCultura status = StatusCultura.PLANTADO;

    @Column(name = "data_plantio", nullable = false)
    private LocalDate dataPlantio;

    @Column(name = "previsao_colheita")
    private LocalDate previsaoColheita;

    @Column(name = "icone", length = 50)
    private String icone;

    @Column(nullable = false)
    @Builder.Default
    private Integer progress = 0;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private Usuario user;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    // Método encapsulado para DDD
    public void atualizarDados(
            String nome,
            BigDecimal area,
            StatusCultura status,
            LocalDate dataPlantio,
            LocalDate previsaoColheita,
            String icone,
            Integer progress) {
        if (nome != null) this.nome = nome;
        if (area != null) this.area = area;
        if (status != null) this.status = status;
        if (dataPlantio != null) this.dataPlantio = dataPlantio;
        this.previsaoColheita = previsaoColheita; // Pode ser null
        if (icone != null) this.icone = icone;
        if (progress != null) this.progress = progress;
    }
}
