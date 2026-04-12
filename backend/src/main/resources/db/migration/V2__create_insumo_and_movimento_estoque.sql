-- V2: Criar tabelas de insumo e movimento de estoque

CREATE TABLE IF NOT EXISTS insumo (
    id BIGSERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    tipo VARCHAR(100) NOT NULL DEFAULT 'FERTILIZANTE',
    quantidade DECIMAL(10,2) NOT NULL DEFAULT 0,
    unidade VARCHAR(20) NOT NULL DEFAULT 'KG',
    preco_unitario DECIMAL(10,2) NOT NULL DEFAULT 0,
    data_validade DATE,
    fornecedor VARCHAR(255),
    estoque_minimo DECIMAL(10,2) DEFAULT 10,
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    user_id BIGINT NOT NULL REFERENCES usuario(id) ON DELETE CASCADE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS movimento_estoque (
    id BIGSERIAL PRIMARY KEY,
    tipo VARCHAR(20) NOT NULL DEFAULT 'ENTRADA',
    quantidade DECIMAL(10,2) NOT NULL,
    quantidade_anterior DECIMAL(10,2),
    quantidade_atual DECIMAL(10,2),
    motivo VARCHAR(255),
    responsavel VARCHAR(255),
    insumo_id BIGINT NOT NULL REFERENCES insumo(id) ON DELETE CASCADE,
    user_id BIGINT NOT NULL REFERENCES usuario(id) ON DELETE CASCADE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_insumo_user_id ON insumo(user_id);
CREATE INDEX IF NOT EXISTS idx_insumo_user_estoque ON insumo(user_id, quantidade);
CREATE INDEX IF NOT EXISTS idx_movimento_estoque_insumo_id ON movimento_estoque(insumo_id);
CREATE INDEX IF NOT EXISTS idx_movimento_estoque_user_id ON movimento_estoque(user_id);
