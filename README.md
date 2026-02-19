# Mars Mission Control - Projeto Base Dojo

## Contexto

Bem-vindo ao painel da colonia em Marte. Este projeto representa o sistema base do **Mars Mission Control**, utilizado no dojo de estagio para evolucao de funcionalidades durante os desafios.

A entidade central inicial e `astronauts`, com suporte a:

- Listagem paginada
- Busca por nome
- Cadastro de novos astronautas

## Pre-requisitos

- Docker e Docker Compose
- Node.js 22+ (apenas se quiser rodar fora do Docker)
- Cliente SQL (DBeaver, TablePlus ou psql)

## Como subir o ambiente

No diretorio raiz do projeto:

```bash
docker-compose up --build
```

Servicos disponiveis:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3333`
- Banco PostgreSQL: `localhost:5432`

## Estrutura de pastas

```text
mars-mission/
├── docker-compose.yml
├── README.md
├── database/
│   └── init.sql                  # Cria e popula a tabela astronauts
├── backend/
│   ├── Dockerfile
│   ├── package.json
│   ├── tsconfig.json
│   ├── .env.example
│   └── src/
│       ├── server.ts
│       ├── database/
│       │   ├── client.ts
│       │   └── types.ts
│       ├── modules/
│       │   └── astronauts/
│       │       ├── astronaut.repository.ts
│       │       ├── astronaut.routes.ts
│       │       └── astronaut.schema.ts
│       └── shared/
│           └── pagination.ts
└── frontend/
    ├── Dockerfile
    ├── package.json
    ├── index.html
    ├── tailwind.config.js
    └── src/
        ├── main.tsx
        ├── App.tsx
        ├── api/
        │   └── astronauts.ts
        ├── components/
        │   ├── AstronautList.tsx
        │   ├── AstronautForm.tsx
        │   └── Pagination.tsx
        └── types/
            └── astronaut.ts
```

## Schema de referencia - tabela `astronauts`

```sql
CREATE TABLE astronauts (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(100) NOT NULL,
  nationality VARCHAR(100) NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'active',
  deleted_at TIMESTAMP DEFAULT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

Observacoes:

- `status` esperado: `active` ou `inactive`
- `deleted_at` e utilizado para soft delete
- Itens com `deleted_at IS NOT NULL` nao devem aparecer nas listagens

## Endpoints existentes

### `GET /health`

Retorna status basico da API.

Resposta:

```json
{ "status": "ok", "mission": "Mars Mission Control" }
```

### `GET /astronauts`

Lista astronautas ativos com paginacao e busca por nome.

Query params:

- `search` (opcional): busca case-insensitive por nome
- `page` (opcional, default `1`)
- `limit` (opcional, default `10`, max `50`)

### `POST /astronauts`

Cria novo astronauta com `status` definido como `active` pelo backend.

Body:

```json
{
  "name": "Valentina Cruz",
  "role": "Commander",
  "nationality": "Brazilian"
}
```

## Sua missao

<!-- A ser preenchido pelo sensei no dia do dojo -->
