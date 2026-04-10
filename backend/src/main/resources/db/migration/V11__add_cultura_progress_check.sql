-- V11: Adicionar CHECK constraint no progress da cultura (0 a 100)

ALTER TABLE cultura
    ADD CONSTRAINT chk_cultura_progress
    CHECK (progress >= 0 AND progress <= 100);
