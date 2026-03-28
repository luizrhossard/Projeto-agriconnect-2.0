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

### Credenciais de Teste

| Usuário | Email | Senha |
|---------|-------|-------|
| Admin | admin@agricultura.com | admin123 |
| Usuário | usuario@agricultura.com | user123 |
Use estas credenciais para entrar na tela de login:

```txt
ADMIN
email: admin@agricultura.com
senha: admin123

USUARIO
email: usuario@agricultura.com
senha: user123
```

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

### Backend
```properties
SPRING_DATASOURCE_URL=jdbc:postgresql://postgres:5432/agricultura
SPRING_DATASOURCE_USERNAME=agricultura
SPRING_DATASOURCE_PASSWORD=agricultura123
APP_JWT_SECRET=chave-secreta-jwt
APP_JWT_EXPIRATION=86400000
```

> Observação: `APP_JWT_SECRET` pode ser uma string Base64 **ou** texto puro.
> Recomenda-se uma chave forte (32+ caracteres).

### Frontend
```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

## 🔧 Comandos Úteis

```bash
# Rebuild completo
docker-compose down -v && docker-compose up --build

# Ver logs
docker-compose logs -f backend

# Acessar banco
docker-compose exec postgres psql -U agricultura -d agricultura
```

## 📄 Licença

MIT License

