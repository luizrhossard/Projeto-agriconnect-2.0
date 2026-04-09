package com.agricultura.domain;

import java.time.LocalDateTime;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "notificacao")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Notificacao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 255)
    private String titulo;

    @Column(length = 500)
    private String mensagem;

    @Column(nullable = false, length = 50)
    @Builder.Default
    private String tipo = "INFO";

    @Column(name = "usuario_id", nullable = false)
    private Long usuarioId;

    @Column(name = "lida", nullable = false)
    @Builder.Default
    private Boolean lida = false;

    @Column(name = "data_criacao", nullable = false, updatable = false)
    private LocalDateTime dataCriacao;

    @PrePersist
    protected void onCreate() {
        this.dataCriacao = LocalDateTime.now();
    }
}
