# Mars Mission Control

Projeto base do programa de estágio da V4 Company

## Visão geral

O repositório está dividido em três serviços:

- `db`: PostgreSQL 15
- `backend`: API REST em Fastify + TypeScript
- `frontend`: React + Vite + TypeScript

Hoje, o módulo de `astronautas` está integrado com backend real.  
Os módulos de `missoes` e `suprimentos` usam APIs fake em memória no frontend, porém já seguem padrão de consulta/mutação com TanStack Query.

## Tecnologias

### Backend

- Fastify
- PostgreSQL (`pg`)
- Zod
- TypeScript

### Frontend

- React 19 + Vite
- React Router
- TanStack Query
- Tailwind CSS + componentes UI
- TypeScript

### Infra

- Docker Compose

## Como rodar

Na raiz do projeto:

```bash
docker-compose up --build
```

Serviços disponíveis:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3333`
- PostgreSQL: `localhost:5432`

Credenciais do banco:

| Campo | Valor |
| --- | --- |
| Host | localhost |
| Porta | 5432 |
| Banco | mars |
| Usuário | mars_user |
| Senha | mars_password |

## Estrutura principal

```text
mars-mission/
├── docker-compose.yml
├── README.md
├── INSTRUCTIONS.md
├── database/
│   └── init.sql
├── backend/
│   ├── package.json
│   └── src/
│       ├── server.ts
│       └── modules/
│           └── astronauts/
│               ├── astronaut.routes.ts
│               ├── astronaut.repository.ts
│               └── astronaut.schema.ts
└── frontend/
    ├── package.json
    └── src/
        ├── App.tsx
        ├── main.tsx
        ├── layouts/AppLayout.tsx
        ├── lib/query-client.ts
        ├── api/
        │   ├── astronauts.ts
        │   ├── missions.ts    # fake API (memória)
        │   └── supplies.ts    # fake API (memória)
        ├── pages/
        │   ├── astronauts/
        │   ├── missions/
        │   └── supplies/
        └── types/
```

## Como o projeto funciona hoje

### Backend (API real)

Rotas de astronautas:

- `GET /health`
- `GET /astronauts`
- `POST /astronauts`

### Frontend

Rotas:

- `/missions`: fluxo de missões (dados fake)
- `/astronauts`: CRUD de astronautas (API real)
- `/supplies`: fluxo de suprimentos (dados fake)

TanStack Query é usado para:

- buscar dados (`useQuery`)
- executar mutações (`useMutation`)
- invalidar cache após criação/edição/remoção

### Fluxo de dados atual

- `Astronautas`: consome backend real
- `Suprimentos`: usa API fake em memória (`src/api/supplies.ts`)
- `Missões`: usa API fake em memória (`src/api/missions.ts`) + lista de astronautas reais para seleção

## Banco de dados

O projeto inclui `database/init.sql` para criação inicial da tabela de astronautas e seed.

Você pode gerenciar o banco com DBeaver usando as credenciais acima.

## Scripts úteis

### Backend (`backend/package.json`)

- `npm run dev`
- `npm run build`
- `npm run lint`

### Frontend (`frontend/package.json`)

- `npm run dev`
- `npm run build`
- `npm run lint`

## Próximos passos

Consulte `INSTRUCTIONS.md` para o enunciado completo do exercício.
