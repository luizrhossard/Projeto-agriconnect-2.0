#!/bin/bash
# Script para configurar git hooks locais
# Execute este script uma vez ao clonar o repositório

echo "Configurando git hooks..."

# Criar diretório de hooks se não existir
mkdir -p .git/hooks

# Copiar hook de pre-commit
cp hooks/pre-commit .git/hooks/pre-commit
chmod +x .git/hooks/pre-commit

echo "Hook de pre-commit configurado com sucesso!"
echo "Agora o Spotless será aplicado automaticamente antes de cada commit."