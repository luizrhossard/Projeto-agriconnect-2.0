package com.agricultura.domain;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import lombok.*;

@Entity
@Table(name = "preco_mercado")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PrecoMercado {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 255)
    private String produto;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal preco;

    @Column(nullable = false, length = 50)
    @Builder.Default
    private String unidade = "sc";

    @Column(precision = 5, scale = 2)
    private BigDecimal variacao;

    @Column(name = "data_atualizacao", nullable = false)
    private LocalDateTime dataAtualizacao;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private Usuario user;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.dataAtualizacao = LocalDateTime.now();
        this.createdAt = LocalDateTime.now();
    }
}
