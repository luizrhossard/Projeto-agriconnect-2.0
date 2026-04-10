-- V9: Adicionar CHECK constraints para garantir integridade dos dados

-- Validar status da cultura
ALTER TABLE cultura
    ADD CONSTRAINT chk_cultura_status
    CHECK (status IN ('PLANTADO', 'EM_CRESCIMENTO', 'COLHENDO', 'COLHIDO'));

-- Validar prioridade da tarefa
ALTER TABLE tarefa
    ADD CONSTRAINT chk_tarefa_prioridade
    CHECK (prioridade IN ('BAIXA', 'MEDIA', 'ALTA', 'URGENTE'));

-- Validar status da tarefa
ALTER TABLE tarefa
    ADD CONSTRAINT chk_tarefa_status
    CHECK (status IN ('PENDENTE', 'EM_ANDAMENTO', 'CONCLUIDA', 'CANCELADA'));

-- Validar tipo de movimento de estoque
ALTER TABLE movimento_estoque
    ADD CONSTRAINT chk_movimento_estoque_tipo
    CHECK (tipo IN ('ENTRADA', 'SAIDA'));

-- Validar tipo de notificacao
ALTER TABLE notificacao
    ADD CONSTRAINT chk_notificacao_tipo
    CHECK (tipo IN ('INFO', 'ALERTA', 'URGENTE', 'SUCESSO'));
