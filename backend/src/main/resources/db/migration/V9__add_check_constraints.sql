-- V9: Adicionar CHECK constraints para garantir integridade dos dados

-- Limpeza de dados para cultura
UPDATE cultura SET status = 'PLANTADO' WHERE status NOT IN ('PLANTADO', 'EM_CRESCIMENTO', 'COLHENDO', 'COLHIDO');

-- Validar status da cultura
ALTER TABLE cultura
    ADD CONSTRAINT chk_cultura_status
    CHECK (status IN ('PLANTADO', 'EM_CRESCIMENTO', 'COLHENDO', 'COLHIDO'));

-- Limpeza de dados para tarefa (prioridade)
UPDATE tarefa SET prioridade = 'MEDIA' WHERE prioridade NOT IN ('BAIXA', 'MEDIA', 'ALTA', 'URGENTE');

-- Validar prioridade da tarefa
ALTER TABLE tarefa
    ADD CONSTRAINT chk_tarefa_prioridade
    CHECK (prioridade IN ('BAIXA', 'MEDIA', 'ALTA', 'URGENTE'));

-- Limpeza de dados para tarefa (status)
UPDATE tarefa SET status = 'PENDENTE' WHERE status NOT IN ('PENDENTE', 'EM_ANDAMENTO', 'CONCLUIDA', 'CANCELADA');

-- Validar status da tarefa
ALTER TABLE tarefa
    ADD CONSTRAINT chk_tarefa_status
    CHECK (status IN ('PENDENTE', 'EM_ANDAMENTO', 'CONCLUIDA', 'CANCELADA'));

-- Limpeza de dados para movimento_estoque
UPDATE movimento_estoque SET tipo = 'ENTRADA' WHERE tipo NOT IN ('ENTRADA', 'SAIDA');

-- Validar tipo de movimento de estoque
ALTER TABLE movimento_estoque
    ADD CONSTRAINT chk_movimento_estoque_tipo
    CHECK (tipo IN ('ENTRADA', 'SAIDA'));

-- Limpeza de dados para notificacao
UPDATE notificacao SET tipo = 'INFO' WHERE tipo NOT IN ('INFO', 'ALERTA', 'URGENTE', 'SUCESSO');

-- Validar tipo de notificacao
ALTER TABLE notificacao
    ADD CONSTRAINT chk_notificacao_tipo
    CHECK (tipo IN ('INFO', 'ALERTA', 'URGENTE', 'SUCESSO'));
