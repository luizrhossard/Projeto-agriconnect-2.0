-- V7: Adicionar FK na notificacao e índices faltantes

-- Adicionar FK em notificacao.usuario_id (ausente na V6)
ALTER TABLE notificacao
    ADD CONSTRAINT fk_notificacao_usuario
    FOREIGN KEY (usuario_id) REFERENCES usuario(id) ON DELETE CASCADE;

-- Índice parcial para contagem de não lidas (otimiza countByUsuarioIdAndLidaFalse)
CREATE INDEX idx_notificacao_nao_lidas ON notificacao(usuario_id) WHERE lida = FALSE;

-- Índice composto para query do scheduler de tarefas
CREATE INDEX idx_tarefa_vencimento_status ON tarefa(data_vencimento, status);
