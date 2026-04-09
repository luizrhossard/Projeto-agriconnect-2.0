package com.agricultura.domain;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "insumo")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Insumo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 255)
    private String nome;

    @Column(nullable = false, length = 100)
    @Builder.Default
    private String tipo = "FERTILIZANTE";

    @Column(nullable = false, precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal quantidade = BigDecimal.ZERO;

    @Column(nullable = false, length = 20)
    @Builder.Default
    private String unidade = "KG";

    @Column(nullable = false, precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal precoUnitario = BigDecimal.ZERO;

    @Column(name = "data_validade")
    private LocalDate dataValidade;

    @Column(length = 255)
    private String fornecedor;

    @Column(name = "estoque_minimo", precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal estoqueMinimo = BigDecimal.valueOf(10);

    @Column(nullable = false)
    @Builder.Default
    private Boolean ativo = true;

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
}
