# Mars Mission Control - Projeto Base Dojo

## Contexto

Bem-vindo ao painel de controle da colônia em Marte. Este projeto representa o sistema base do **Mars Mission Control**, utilizado no dojo de estágio para evolução de funcionalidades durante os desafios.

O projeto já conta com três páginas no frontend — **Missões**, **Astronautas** e **Suprimentos** — mas apenas o módulo de **Astronautas** está conectado à API. As páginas de Missões e Suprimentos operam com dados locais e servem como ponto de partida para os desafios.

## Pré-requisitos

- Docker e Docker Compose
- Node.js 22+ (apenas se quiser rodar fora do Docker)
- Cliente SQL (DBeaver, TablePlus ou psql)

## Como subir o ambiente

No diretório raiz do projeto:

```bash
docker-compose up --build
```

Serviços disponíveis:

- **Frontend:** `http://localhost:5173`
- **Backend:** `http://localhost:3333`
- **Banco PostgreSQL:** `localhost:5432`

Credenciais do banco:

| Campo  | Valor          |
| ------ | -------------- |
| Host   | localhost      |
| Porta  | 5432           |
| Banco  | mars           |
| Usuário| mars_user      |
| Senha  | mars_password  |

## Stack

### Backend

- **Fastify** — framework HTTP
- **pg (node-postgres)** — driver PostgreSQL
- **Zod** — validação de schemas
- **TypeScript**

### Frontend

- **React 19** com **Vite**
- **React Router** — roteamento por páginas
- **TanStack React Query** — gerenciamento de requisições
- **Tailwind CSS** — estilização
- **Lucide React** — ícones
- **TypeScript**

### Infra

- **Docker Compose** — orquestração dos serviços (db, backend, frontend)

## Estrutura de pastas

```text
trainee-program/
├── docker-compose.yml
├── README.md
├── SPEC.md
├── database/
│   └── init.sql                           # Cria e popula a tabela astronauts
├── backend/
│   ├── Dockerfile
│   ├── package.json
│   ├── tsconfig.json
│   ├── .env.example
│   └── src/
│       ├── server.ts                      # Entry point — registra plugins e rotas
│       ├── database/
│       │   ├── client.ts                  # Pool de conexão (pg)
│       │   └── types.ts                   # Tipos do schema do banco
│       ├── modules/
│       │   └── astronauts/
│       │       ├── astronaut.repository.ts  # Queries SQL
│       │       ├── astronaut.routes.ts      # Rotas Fastify
│       │       └── astronaut.schema.ts      # Schemas Zod (validação)
│       └── shared/
│           ├── pagination.ts              # Helper de paginação reutilizável
│           └── utils.ts                   # Formatação de respostas e erros
└── frontend/
    ├── Dockerfile
    ├── package.json
    ├── index.html
    └── src/
        ├── main.tsx
        ├── App.tsx                        # Rotas (React Router)
        ├── api/
        │   └── astronauts.ts              # Funções de fetch para a API
        ├── components/
        │   ├── Pagination.tsx
        │   ├── SidebarButton.tsx
        │   └── ui/                        # Componentes base (button, card, input, etc.)
        ├── data/
        │   └── fake-data.ts               # Dados locais de missões e suprimentos
        ├── layouts/
        │   └── AppLayout.tsx              # Layout com sidebar de navegação
        ├── lib/
        │   ├── query-client.ts            # Instância do React Query
        │   └── utils.ts                   # Utilitários (cn, etc.)
        ├── pages/
        │   ├── astronauts/
        │   │   ├── AstronautsPage.tsx
        │   │   └── components/
        │   │       ├── AstronautForm.tsx
        │   │       ├── AstronautSearch.tsx
        │   │       └── AstronautsList.tsx
        │   ├── missions/
        │   │   ├── MissionsPage.tsx        # Dados locais (sem API)
        │   │   └── components/
        │   │       ├── MissionForm.tsx
        │   │       └── MissionsList.tsx
        │   └── supplies/
        │       ├── SuppliesPage.tsx        # Dados locais (sem API)
        │       └── components/
        │           ├── SuppliesForm.tsx
        │           └── SuppliesList.tsx
        └── types/
            ├── astronaut.ts
            ├── missions.ts
            └── supplies.ts
```

## Schema de referência — tabela `astronauts`

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

Observações:

- `status` esperado: `active` ou `inactive`
- `deleted_at` é utilizado para soft delete
- Itens com `deleted_at IS NOT NULL` não devem aparecer nas listagens
- O seed inicial insere 20 astronautas fictícios para testes

## Endpoints existentes

### `GET /health`

Retorna status básico da API.

Resposta:

```json
{ "status": "ok", "mission": "Mars Mission Control" }
```

### `GET /astronauts`

Lista astronautas ativos com paginação e busca por nome.

Query params:

| Parâmetro | Tipo   | Obrigatório | Descrição                                         |
| --------- | ------ | ----------- | ------------------------------------------------- |
| `search`  | string | não         | Filtra por nome (case-insensitive, busca parcial)  |
| `page`    | number | não         | Página atual. Default: `1`                         |
| `limit`   | number | não         | Itens por página. Default: `10`. Máximo: `50`      |

Resposta `200`:

```json
{
  "data": [
    {
      "id": 1,
      "name": "Valentina Cruz",
      "role": "Commander",
      "nationality": "Brazilian",
      "status": "active",
      "created_at": "2025-01-01T00:00:00.000Z",
      "updated_at": "2025-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "total": 20,
    "page": 1,
    "limit": 10,
    "totalPages": 2
  }
}
```

### `POST /astronauts`

Cria um novo astronauta. O campo `status` é definido como `active` pelo backend.

Body:

```json
{
  "name": "Valentina Cruz",
  "role": "Commander",
  "nationality": "Brazilian"
}
```

Validações (via Zod):

- `name`: obrigatório, string, mínimo 2 caracteres
- `role`: obrigatório, string, mínimo 1 caractere
- `nationality`: obrigatório, string, mínimo 1 caractere

Resposta `201`: retorna o astronauta criado.

Resposta `400` (erro de validação):

```json
{
  "error": "Validation error",
  "details": ["String must contain at least 2 character(s)"]
}
```

### `PUT /astronauts/:id`

Atualiza um astronauta existente. Todos os campos são opcionais, mas pelo menos um deve ser enviado.

Body (todos opcionais):

```json
{
  "name": "Valentina Cruz",
  "role": "Engenheiro de Voo",
  "nationality": "Brazilian",
  "status": "inactive"
}
```

- `status` aceita apenas `"active"` ou `"inactive"`
- Retorna `200` com o astronauta atualizado
- Retorna `404` se o astronauta não existir ou estiver deletado

### `DELETE /astronauts/:id`

Realiza soft delete (preenche `deleted_at`). O registro não é removido do banco.

- Retorna `204 No Content` em caso de sucesso
- Retorna `404` se o astronauta não existir ou já estiver deletado

## Páginas do frontend

| Rota            | Página       | Dados              |
| --------------- | ------------ | ------------------ |
| `/missions`     | Missões      | Dados locais (fake)|
| `/astronautas`  | Astronautas  | API REST           |
| `/suprimentos`  | Suprimentos  | Dados locais (fake)|

- A página de **Astronautas** é a única conectada ao backend, com CRUD completo (criar, listar, editar, deletar)
- As páginas de **Missões** e **Suprimentos** operam com dados em memória e servem como base para evolução nos desafios

## Sua missão

<!-- A ser preenchido pelo sensei no dia do dojo -->
