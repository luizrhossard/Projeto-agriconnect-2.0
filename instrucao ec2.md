<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

# [https://github.com/luizrhossard/Projeto-agriconnect-2.0](https://github.com/luizrhossard/Projeto-agriconnect-2.0)

Visando esse meu projeto que quero colocar em uma EC2 da AWS você acha que os códitos e a estrutura está boa para ir para a hospedagem do jeito que tá

O projeto tem uma estrutura bem organizada, mas **há alguns problemas críticos que precisam ser resolvidos antes de hospedar na EC2**, especialmente questões de segurança e configuração de ambiente.

## 🔴 Problemas Críticos (resolver antes de subir)

### Credenciais hardcoded no docker-compose.yml

Esse é o ponto mais grave. O arquivo `docker-compose.yml`  contém credenciais expostas diretamente no repositório público:

- **Senha do banco**: `POSTGRES_PASSWORD: agricultura123`
- **JWT Secret**: `APP_JWT_SECRET: cHJveWV0by1zcH...` (base64 hardcoded)
- **URL da API no frontend**: `NEXT_PUBLIC_API_URL=http://localhost:8080` — em produção isso precisa ser o IP público ou domínio da EC2, não `localhost`

O correto para produção é usar um arquivo `.env` fora do repositório e referenciar com `${VARIAVEL}` no compose .

### Profile ativo como `dev` em produção

O backend está com `SPRING_PROFILES_ACTIVE: dev` . Para a EC2 você deve criar um perfil `prod` com configurações como logs menos verbosos, sem console do H2, etc.

***

## 🟡 Pontos que precisam de atenção

### Sem Reverse Proxy estruturado (Nginx Proxy Manager / Traefik)

O docker-compose expõe o backend na porta `8080` e o frontend na `3000` diretamente . Em produção você precisa de um Reverse Proxy moderno na frente para redirecionar o tráfego HTTP/HTTPS (porta 80/443), fazer o proxy para os containers e gerenciar SSL.
**Recomendação:** Ao invés do Nginx "cru" com Certbot manual, prefira usar o **Nginx Proxy Manager** (que já sobe no compose com uma interface web para gerenciar domínios e certificados auto-renováveis com facilidade) ou **Traefik**.

### Frontend apontando para localhost

O `NEXT_PUBLIC_API_URL=http://localhost:8080` no build do frontend  vai fazer as chamadas de API falharem no browser do usuário, pois o `localhost` dele não é a EC2. Precisa ser o domínio ou IP público da sua instância.

### Sem healthcheck no backend

O postgres tem healthcheck configurado, mas o backend não . Adicionar um healthcheck no serviço backend garante que o container reinicie automaticamente se travar.

***

## ⚙️ Infraestrutura, DevOps e Prevenções (Adições Cruciais)

### Limite nos Logs do Docker (Evitar Disco Cheio)
Por padrão, logs no Docker crescem indefinidamente. Como a EC2 possui limite de EBS, isso vai esgotar o disco e derrubar os serviços (Postgres incluso). Adicione configuração de log global ou para os containers no arquivos compose: `driver: "json-file"` com opções de `max-size: "10m"` e `max-file: "3"`.

### Memória SWAP (Problema de OOM Killed no t2.micro)
Se a sua instância é uma `t2.micro` (1GB RAM), o processo de subir ao mesmo tempo o Postgres, Java Spring, e orquestrar a Build em Node.js do Next vai estourar essa memória, matando instâncias do nada (OOM Killed). **Crie arquivos de SWAP (2GB ou 4GB)** diretamente no host Linux da sua EC2. Melhor ainda: construa as imagens prontas fora da máquina e evite o `npm run build` na própria EC2.

### Pipeline de CD (Deploy Contínuo) Automático
Você pode aproveitar os testes do Github Actions para adicionar em seguida uma rotina de conexão via SSH Action apontando para sua EC2, para automaticamente renovar os containers logo após as validações na tag Main. O processo manual atrasará e te desencorajará com o tempo.

### Rotina de Backup Real de Banco
Não confie unicamente nos volumes nomeados persistidos do `docker-compose.yml`. Se por falha você remover a instância ou o EBS for corrompido, dirá tchau aos dados de banco. Adicione um painel secundário (ex. container CRON) extraindo `pg_dump` diariamente em um bucket externo do S3 da AWS.

***

## ✅ O que está bom

- Estrutura monorepo bem separada (`backend/`, `frontend/`)
- Docker Compose com `depends_on` e healthcheck no postgres
- `restart: unless-stopped` nos serviços  — correto para EC2
- `.env.example` presente no backend  — boa prática documentada
- Volumes nomeados para persistência do banco

***

## Checklist para antes de subir na EC2

1. **Criar um `.env` na EC2** com as credenciais reais de banco de dados e segredos JWT
2. **Alterar o docker-compose** para usar `${VAR}` referenciando o arquivo de variáveis na EC2.
3. **Mapear Docker Logs** adicionando propriedades de `max-size` em cada serviço pesado
4. **Alocar Memória Swap** no Host EC2 caso a instância tenha 1GB/2GB de RAM física
5. **Trocar parâmetro** `SPRING_PROFILES_ACTIVE` de `dev` para `prod`
6. **Adicionar Nginx Proxy Manager** como container para tratar requisições na porta 80 e emitir o Let's Encrypt para os domínios
7. **Corrigir variável** `NEXT_PUBLIC_API_URL` para o endereço web final (seu domínio) em produção
8. **Configurar Security Groups** da EC2 na AWS liberando apenas SSH e portas 80 e 443 (HTTP/HTTPS)
9. **Criar script de Backup DB**, empilhando `pg_dump` pra um S3 esporadicamente.

Você pretende usar um domínio próprio nessa EC2 ou vai acessar pelo IP público mesmo?

