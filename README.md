# Dashboard Agrícola - Monorepo

Projeto completo de dashboard agrícola com backend Spring Boot e frontend Next.js.

## 🏗️ Estrutura do Projeto

```
projeto-spring/
├── backend/                  # Spring Boot API (Java 21)
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/agricultura/
│   │   │   │   ├── config/
│   │   │   │   ├── controller/
│   │   │   │   ├── service/
│   │   │   │   ├── repository/
│   │   │   │   ├── domain/
│   │   │   │   ├── dto/
│   │   │   │   ├── exception/
│   │   │   │   └── security/
│   │   │   └── resources/
│   │   │       ├── application.properties
│   │   │       └── db/migration/
│   │   └── test/
│   ├── pom.xml
│   └── Dockerfile
│
├── frontend/                 # Next.js App (TypeScript)
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   ├── context/
│   │   └── lib/
│   ├── package.json
│   ├── .env.local.example
│   └── Dockerfile
│
├── docker-compose.yml
└── README.md
```

## 🚀 Quick Start

### Pré-requisitos
- Docker Desktop instalado
- Docker Compose instalado

### Executando o projeto

```bash
# Na raiz do projeto
docker-compose up --build
```

A aplicação estará disponível em:
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:8080
- **Banco de Dados**: localhost:5432

### ⚠️ Credenciais de Teste (Apenas Desenvolvimento)

> **⛔ NÃO USE EM PRODUÇÃO!** Estas credenciais são exclusivamente para testes locais durante o desenvolvimento.

| Usuário | Email | Senha |
|---------|-------|-------|
| Admin | admin@agricultura.com | admin123 |
| Usuário | usuario@agricultura.com | user123 |

Use estas credenciais para entrar na tela de login.

> **🔒 Para produção:** Crie credenciais fortes e armazene-as em variáveis de ambiente ou um cofre de segredos (ex: AWS Secrets Manager, HashiCorp Vault).



## 🐳 Executando sem Docker

### Backend (Spring Boot)

```bash
cd backend

# Criar banco PostgreSQL local
createdb agricultura

# Executar
./mvnw spring-boot:run
```

### Frontend (Next.js)

```bash
cd frontend

# Criar arquivo .env.local
cp .env.local.example .env.local

# Instalar dependências
npm install

# Executar em modo desenvolvimento
npm run dev
```

## 📡 Endpoints da API

### Autenticação
- `POST /api/auth/register` - Registrar novo usuário
- `POST /api/auth/login` - Login (retorna JWT)
- `GET /api/auth/me` - Dados do usuário atual

### Culturas
- `GET /api/culturas` - Listar todas as culturas
- `POST /api/culturas` - Criar cultura
- `PUT /api/culturas/{id}` - Atualizar cultura
- `DELETE /api/culturas/{id}` - Deletar cultura

### Tarefas
- `GET /api/tarefas` - Listar todas as tarefas
- `POST /api/tarefas` - Criar tarefa
- `PUT /api/tarefas/{id}` - Atualizar tarefa
- `DELETE /api/tarefas/{id}` - Deletar tarefa

### Preços de Mercado
- `GET /api/precos` - Listar preços
- `POST /api/precos` - Criar preço

### Dashboard
- `GET /api/dashboard/resumo` - Resumo agregad

## 🛠️ Stack Tecnológica

### Backend
- Java 21
- Spring Boot 3.2
- Spring Security + JWT
- Spring Data JPA
- PostgreSQL
- Flyway (migrations)
- Maven

### Frontend
- Next.js 16
- TypeScript
- Tailwind CSS 4
- shadcn/ui
- React Hook Form + Zod
- Framer Motion

## 📝 Variáveis de Ambiente

> **⚠️ ATENÇÃO:** Os valores abaixo são **apenas exemplos para desenvolvimento local**. Nunca use estes valores em produção.

### Backend

```properties
SPRING_DATASOURCE_URL=jdbc:postgresql://postgres:5432/agricultura
SPRING_DATASOURCE_USERNAME=agricultura
SPRING_DATASOURCE_PASSWORD=agricultura123  # ⚠️ Apenas para dev! Use senha forte em produção
APP_JWT_SECRET=chave-secreta-jwt           # ⚠️ Apenas para dev! Gere uma chave forte (32+ caracteres)
APP_JWT_EXPIRATION=86400000
```

> **🔐 Gerando JWT_SECRET seguro:**
> ```bash
> # Linux/Mac
> openssl rand -base64 64
> 
> # Windows (PowerShell)
> [Convert]::ToBase64String((1..48 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
> ```

> **📌 Recomendações para produção:**
> - Use senhas com mínimo de 32 caracteres para JWT
> - Armazene secrets em variáveis de ambiente do sistema ou cofres de segredos
> - Nunca commite secrets no repositório
> - Use `.env` files no `.gitignore` para desenvolvimento

### Frontend
```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

## 🔧 Comandos Úteis

### Docker
```bash
# Rebuild completo
docker-compose down -v && docker-compose up --build

# Ver logs
docker-compose logs -f backend

# Acessar banco
docker-compose exec postgres psql -U agricultura -d agricultura
```

### Qualidade de Código

```bash
# Formatar código automaticamente (Spotless)
mvn spotless:apply

# Verificar formatação (sem alterar)
mvn spotless:check

# Rodar todos os testes + gerar relatório de cobertura
mvn test

# Abrir relatório de cobertura (HTML)
# O relatório é gerado automaticamente em: target/site/jacoco/index.html

# Verificar cobertura mínima (70%)
mvn test jacoco:check
```

### 📊 Métricas de Testes

- **Total de testes**: 28
- **Tipos**: Unitários (Services) + Controller Tests (WebMvcTest)
- **Cobertura mínima**: 70% (configurado no JaCoCo)
- **Relatório HTML**: `target/site/jacoco/index.html`

## 🧪 Guia de Testes

### Comandos Básicos

```bash
# Rodar TODOS os testes + gerar relatório de cobertura
mvn test

# Rodar um teste específico
mvn test -Dtest=TarefaServiceTest

# Rodar um método específico de um teste
mvn test -Dtest=TarefaServiceTest#create_Success

# Rodar todos os testes de um pacote
mvn test -Dtest="com.agricultura.service.*"

# Verificar se cobertura está acima do mínimo (70%)
mvn test jacoco:check
```

### 📊 Visualizando Relatórios

Após rodar `mvn test`, o relatório HTML é gerado automaticamente:

```bash
# Abrir relatório no navegador (Windows)
start target/site/jacoco/index.html

# Abrir relatório no navegador (Linux/Mac)
xdg-open target/site/jacoco/index.html   # Linux
open target/site/jacoco/index.html       # Mac
```

**O que você verá no relatório:**
- **Página principal**: Cobertura geral do projeto
- **Clicando em um pacote**: Cobertura classe por classe
- **Clicando em uma classe**: Linhas cobertas (🟢 verde) vs não cobertas (🔴 vermelho)

### 🔄 Workflow Recomendado

#### Antes de Commitar (Recomendado)
```bash
# 1. Formatar código automaticamente
mvn spotless:apply

# 2. Rodar testes + gerar cobertura
mvn test

# 3. Verificar se cobertura está OK (mín. 70%)
mvn test jacoco:check
```

#### Durante Desenvolvimento (Rápido)
```bash
# Rodar apenas testes do serviço que está mexendo
mvn test -Dtest=CulturaServiceTest

# Ou do controller específico
mvn test -Dtest=AuthControllerTest
```

### 📁 Estrutura de Testes

```
backend/src/test/java/com/agricultura/
├── controller/
│   ├── AuthControllerTest.java        (4 testes - @WebMvcTest)
│   └── CulturaControllerTest.java     (5 testes - @WebMvcTest)
└── service/
    ├── AuthServiceTest.java           (5 testes - @MockitoExtension)
    ├── CulturaServiceTest.java        (6 testes - @MockitoExtension)
    └── TarefaServiceTest.java         (8 testes - @MockitoExtension)
```

**Total: 28 testes**

### 🎓 Equivalência: Laravel vs Spring Boot

| Laravel | Spring Boot (este projeto) | Descrição |
|---------|---------------------------|-----------|
| `phpunit` | `mvn test` | Rodar todos os testes |
| `phpunit --coverage` | `mvn test` | Gerar relatório de cobertura |
| `phpunit --filter NomeTeste` | `mvn test -Dtest=NomeTeste` | Rodar teste específico |
| `./vendor/bin/php-cs-fixer fix` | `mvn spotless:apply` | Formatar código |
| `coverage/index.html` | `target/site/jacoco/index.html` | Relatório de cobertura |
| PHP_CodeSniffer | `mvn spotless:check` | Verificar estilo de código |

### ⚠️ Troubleshooting

| Problema | Causa | Solução |
|----------|-------|---------|
| `Tests run: X, Failures: Y` | Assertion falhou | Leia a stack trace para ver qual assertion falhou |
| `Tests run: X, Errors: Y` | Exceção no teste (ex: NullPointerException) | Verifique se todos os mocks estão configurados |
| `BUILD FAILURE` no `spotless:check` | Código não está formatado | Rode `mvn spotless:apply` |
| `jacoco:check failed` | Cobertura abaixo de 70% | Crie mais testes para classes não cobertas |
| Testes muito lentos | Muitos testes integrando com banco | Considere usar `@Mock` ao invés de banco real |

## 🔒 Segurança para Produção

> **⚠️ IMPORTANTE:** Antes de deployar em produção, siga estas recomendações:

### Checklist de Segurança
- [ ] Alterar **todas** as senhas padrão (banco, JWT, usuários)
- [ ] Gerar `APP_JWT_SECRET` forte e único (mínimo 32 caracteres)
- [ ] Usar HTTPS no frontend e backend
- [ ] Configurar CORS restritivo (apenas domínios autorizados)
- [ ] Habilitar rate limiting nos endpoints
- [ ] Usar variáveis de ambiente ou cofre de segredos (AWS Secrets Manager, HashiCorp Vault)
- [ ] Nunca commitar `.env` files no repositório
- [ ] Ativar logs de auditoria e monitoramento
- [ ] Manter dependências atualizadas (verificar vulnerabilidades)

### Gerenciamento de Secrets
```bash
# Exemplo: gerando JWT secret seguro
openssl rand -base64 64

# Verificando se .env está no .gitignore
grep -q "\.env" .gitignore && echo "✓ .env está no .gitignore" || echo "✗ Adicione .env ao .gitignore"
```

## 📄 Licença

MIT License

