-- V8: Padronizar nomenclatura de usuario_id para user_id na tabela notificacao
-- Todas as outras tabelas usam user_id, esta era a única inconsistente

ALTER TABLE notificacao RENAME COLUMN usuario_id TO user_id;

-- Renomear índices que referenciavam a coluna antiga
DROP INDEX IF EXISTS idx_notificacao_usuario_lida;
CREATE INDEX idx_notificacao_usuario_lida ON notificacao(user_id, lida);

DROP INDEX IF EXISTS idx_notificacao_nao_lidas;
CREATE INDEX idx_notificacao_nao_lidas ON notificacao(user_id) WHERE lida = FALSE;
