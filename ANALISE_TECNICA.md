# Análise Técnica do Projeto AgriConnect 2.0

Este documento descreve, de forma técnica e direta, os principais pontos fortes, decisões de arquitetura e oportunidades de melhoria do projeto AgriConnect 2.0. Ele foi pensado para ser incluído no repositório como um arquivo de documentação adicional (por exemplo, `ANALISE_TECNICA.md`).

## Visão Geral

O AgriConnect 2.0 é um monorepo que reúne um backend em Spring Boot (Java 21) e um frontend em Next.js (TypeScript), orquestrados via Docker Compose, com PostgreSQL como banco de dados principal.[cite:1][cite:3][cite:4]
O projeto implementa autenticação com JWT, versionamento de banco via Flyway, documentação de API com Swagger/OpenAPI e um conjunto sólido de testes automatizados com relatório de cobertura via JaCoCo.[cite:3][cite:4]

## Arquitetura de Backend

O backend é um serviço Spring Boot 3.2.5 rodando em Java 21, organizado em pacotes bem definidos: `config`, `controller`, `service`, `repository`, `domain`, `dto`, `exception` e `security`.[cite:3][cite:4]
A aplicação utiliza Spring Web, Spring Data JPA, Spring Security, Bean Validation, PostgreSQL em runtime, H2 para testes e Flyway para migrations, o que dá uma base moderna e adequada para aplicações enterprise.[cite:3]

### Autenticação e Segurança

A autenticação é baseada em JWT, usando a biblioteca `io.jsonwebtoken` (jjwt), com configuração para API stateless via Spring Security.[cite:3][cite:4]
Existem endpoints dedicados para registro, login e consulta do usuário autenticado (`/api/auth/register`, `/api/auth/login`, `/api/auth/me`), alinhados com práticas comuns de APIs REST seguras.[cite:4]

### Modelagem de Domínio e Dados

O domínio agrícola contempla módulos como Culturas, Tarefas, Preços de Mercado e Dashboard de resumo, com endpoints específicos para CRUD e agregações.[cite:4]
O banco PostgreSQL é gerenciado via Flyway, com pasta padrão de migrations em `backend/src/main/resources/db/migration`, facilitando versionamento de esquema e deploy em múltiplos ambientes.[cite:4]

### Qualidade de Código e Testes

O projeto usa o plugin Spotless com Palantir Java Format para padronização de código Java, incluindo comandos para aplicar e verificar formatação (`mvn spotless:apply` e `mvn spotless:check`).[cite:3][cite:4]
A cobertura de testes é gerenciada via JaCoCo, com configuração de cobertura mínima de 70% e relatório HTML gerado em `target/site/jacoco/index.html`, além de um guia detalhado de como rodar e analisar testes no README.[cite:3][cite:4]

## Arquitetura de Frontend

O frontend é uma aplicação Next.js (indicada como versão 16) com TypeScript, Tailwind CSS 4, shadcn/ui, React Hook Form, Zod e Framer Motion, organizada em `app`, `components`, `context` e `lib`.[cite:4]
O frontend se comunica com o backend via variável de ambiente `NEXT_PUBLIC_API_URL`, permitindo trocar facilmente entre ambientes de desenvolvimento e produção.[cite:4]

### Padrões de UI/UX

O uso de Tailwind CSS e shadcn/ui indica um foco em componentes reutilizáveis e consistentes, com possibilidade de construção rápida de telas e formulários.[cite:4]
A combinação de React Hook Form e Zod sugere validação de formulários robusta, alinhada com as regras de negócio do backend.[cite:4]

## Infraestrutura, CI/CD e DevOps

O projeto conta com um pipeline de **Integração Contínua (CI)** rigoroso via GitHub Actions configurado em `.github/workflows/ci.yml`. O workflow valida simultaneamente o ecossistema a cada Push ou Pull Request apontado para a branch principal (`main`/`master`):
- **Backend**: Valida a formatação do código (`mvnw spotless:check`) e executa a suíte de testes com validação de cobertura via JaCoCo.
- **Frontend**: Instala dependências nativas puras (`npm ci`), aplica checagem pesada via Eslint (`npm run lint`) e simula com sucesso a build de produção (`npm run build`).

Além das pipelines em nuvem, localmente o projeto possui um `docker-compose.yml` na raiz, que sobe backend, frontend e banco de dados PostgreSQL, facilitando o ambiente de desenvolvimento e testes integrados.[cite:1][cite:4]
Cada serviço (backend e frontend) possui seu próprio Dockerfile, permitindo build independente e futura publicação em registries ou uso em pipelines de deployment contínuo.[cite:2][cite:4]

### Execução Local

O README documenta claramente como subir o stack completo com `docker-compose up --build`, bem como como rodar backend e frontend separadamente sem Docker, o que ajuda tanto em desenvolvimento quanto em troubleshooting.[cite:4]
Também há instruções para acessar o banco via Docker (`docker-compose exec postgres psql -U agricultura -d agricultura`), mostrando preocupação com a experiência do desenvolvedor.[cite:4]

## Testes Automatizados

A estrutura de testes está organizada em `controller` (WebMvcTest) e `service` (Mockito + JUnit), cobrindo casos de autenticação, culturas e tarefas.[cite:4]
O README traz um guia detalhado de comandos para rodar todos os testes, testes específicos, pacotes específicos e como abrir o relatório de cobertura no navegador, além de uma analogia com o fluxo de testes em Laravel, o que facilita onboarding de devs com background PHP.[cite:4]

## Segurança e Boas Práticas

O projeto destaca claramente no README a diferença entre credenciais de desenvolvimento e produção, com tabelas de usuários de teste e avisos explícitos para não reutilizar essas credenciais em ambientes produtivos.[cite:4]
Há uma seção de checklist de segurança para produção (alterar senhas padrão, usar HTTPS, CORS restritivo, rate limiting, cofres de segredo, etc.), demonstrando preocupação com hardening antes de deploy real.[cite:4]

## Pontos Fortes do Projeto

- **Arquitetura limpa e modular**: separação clara entre camadas (controller, service, repository, domain, dto, security), facilitando manutenção e testes.[cite:4]
- **Stack moderna**: Java 21, Spring Boot 3.2, Next.js, TypeScript, Tailwind, shadcn, ferramentas atuais do ecossistema Java e JavaScript.[cite:3][cite:4]
- **Qualidade e testes**: uso de Spotless, JaCoCo, testes em controllers e services, metas de cobertura configuradas e documentadas.[cite:3][cite:4]
- **Dev Experience**: README muito completo, com exemplos, comandos, equivalências com Laravel e instruções para Docker e ambiente local.[cite:4]
- **Foco em segurança**: avisos sobre credenciais, gerenciamento de secrets, checklist de produção e uso de JWT com Spring Security.[cite:3][cite:4]

## Oportunidades de Melhoria

- **Documentação de casos de uso**: adicionar uma seção com fluxos funcionais principais (ex: "Criar cultura e associar tarefas", "Atualizar preço de mercado e ver impacto no dashboard") para ajudar novos devs e recrutadores a entenderem o valor de negócio.
- **Diagrama de arquitetura**: incluir um diagrama simples (por exemplo, mermaid) mostrando como frontend, backend e banco se comunicam, e onde entram autenticação e dashboard.
- **Mais detalhes de domínio**: documentar entidades principais (Cultura, Tarefa, Preço, Usuário) com atributos e relacionamentos, talvez em uma seção "Modelo de Domínio".
- **Observabilidade**: mencionar ou adicionar logging estruturado, rastreamento de erros e métricas (por exemplo, usando Spring Actuator) como próximos passos.
- **CI/CD**: Expandir o atual pipeline de CI para incluir Continuous Deployment (CD) automático após os testes de Actions, automatizando o release no ambiente de produção.

## Arquitetura de Diretórios e Escopo (Para Contexto de IA)

Para otimizar o fluxo de desenvolvimento sem a necessidade de explorar diretórios recorrentemente de forma cega, aqui estão os caminhos e regras de estruturação:

### Backend (Pacotes e Padrões)
- **Pacote Raiz:** O pacote absoluto é `com.agricultura` (`backend/src/main/java/com/agricultura`).
- **Banco de Dados:** O versionamento do PostgreSQL ocorre via scripts do Flyway em `backend/src/main/resources/db/migration/` (ex: `V1__create_tables.sql` a `V13__add_partial_index_low_stock.sql`).
- **Entidades Principais:** No pacote `domain`, temos os relacionamentos essenciais: `Usuario`, `Cultura`, `Tarefa`, `PrecoMercado`, `Insumo`, `MovimentoEstoque`, e `Notificacao`. 
- **Padrão HTTP/API:** O projeto adota uma estrita separação em camadas. Os artefatos na camada `controller` recebem e retornam exclusivamente objetos do pacote `dto` agrupados por uma `ResponseEntity`. Nunca são vazadas Entidades JPA nativas pela internet, e Exceções são convertidas sob o pacote `exception` com DTO padronizado.

### Frontend (Next.js e Rotas)
- **Roteamento:** O projeto utiliza abertamente a Next.js **App Router** (`frontend/src/app`).
- **API e Integração:** Não utilizamos Axios. Toda a comunicação com o backend ocorre por uma camada especializada de Fetch API wrapper com tratamento nativo em um único arquivo: `frontend/src/lib/api.ts`. Neste arquivo, encontram-se todas as `interfaces` TS (Requests e Responses), e qualquer novo DTO adicionado ao Spring Boot deve ter sua interface replicada lá.
- **Componentes:** Ficam localizados centralmente em `frontend/src/components` isoladamente das lógicas de serviços globais.

## Sugestão de Uso deste Arquivo

- Nome recomendado: `ANALISE_TECNICA.md` ou `TECHNICAL_OVERVIEW.md` na raiz do repositório.
- Referenciar este arquivo no `README.md` em uma seção do tipo "📄 Documentação Adicional" para que recrutadores e colaboradores encontrem facilmente uma visão técnica aprofundada do projeto.
