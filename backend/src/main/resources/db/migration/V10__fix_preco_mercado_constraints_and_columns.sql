-- V10: Corrigir inconsistencias na tabela preco_mercado

-- Tornar user_id NOT NULL (alinhar com JPA @JoinColumn(nullable = false))
-- Primeiro, definir valor default para registros existentes que possam ter NULL
UPDATE preco_mercado SET user_id = (SELECT id FROM usuario ORDER BY id LIMIT 1) WHERE user_id IS NULL;
ALTER TABLE preco_mercado ALTER COLUMN user_id SET NOT NULL;

-- Adicionar coluna data_atualizacao se nao existir (usado pela entidade JPA)
ALTER TABLE preco_mercado
    ADD COLUMN IF NOT EXISTS data_atualizacao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP;
