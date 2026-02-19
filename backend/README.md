# Mars Mission Control — Backend

API REST para gerenciamento de astronautas da missão Mars Mission Control.

## Tecnologias

- **Fastify** — framework HTTP
- **pg (node-postgres)** — driver PostgreSQL (raw SQL)
- **Zod** — validação de schemas
- **TypeScript** — linguagem

## Configuração

1. Instale as dependências:

```bash
pnpm install
```

2. Crie um arquivo `.env` na raiz do backend (veja `.env.example`):

```
DATABASE_URL=postgresql://mars_user:mars_password@localhost:5432/mars
PORT=3333
```

3. Inicie o servidor em modo desenvolvimento:

```bash
pnpm dev
```

O servidor estará disponível em `http://localhost:3333`.

## Estrutura

```text
src/
├── server.ts                            # Entry point — registra plugins e rotas
├── database/
│   ├── client.ts                        # Pool de conexão (pg)
│   └── types.ts                         # Tipos do schema do banco (AstronautRow)
├── modules/
│   └── astronauts/
│       ├── astronaut.repository.ts      # Queries SQL (raw)
│       ├── astronaut.routes.ts          # Rotas Fastify
│       └── astronaut.schema.ts          # Schemas Zod (validação)
└── shared/
    ├── pagination.ts                    # Helper de paginação reutilizável
    └── utils.ts                         # formatRow e formatZodError
```

## Endpoints

### Health Check

```bash
curl http://localhost:3333/health
```

### Listar astronautas

Retorna uma lista paginada de astronautas.

```bash
# listagem padrão (página 1, limite 10)
curl http://localhost:3333/astronauts
```

```bash
# com paginação
curl "http://localhost:3333/astronauts?page=2&limit=5"
```

```bash
# buscar por nome
curl "http://localhost:3333/astronauts?search=marcos"
```

### Criar astronauta

Campos obrigatórios: `name`, `role`, `nationality`.

```bash
curl -X POST http://localhost:3333/astronauts \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Marcos Pontes",
    "role": "Comandante",
    "nationality": "Brasileiro"
  }'
```

### Atualizar astronauta

Todos os campos são opcionais (envie apenas o que deseja alterar). O campo `status` aceita `"active"` ou `"inactive"`.

```bash
curl -X PUT http://localhost:3333/astronauts/1 \
  -H "Content-Type: application/json" \
  -d '{
    "role": "Engenheiro de Voo",
    "status": "inactive"
  }'
```

### Deletar astronauta (soft delete)

Retorna `204 No Content` em caso de sucesso.

```bash
curl -X DELETE http://localhost:3333/astronauts/1
```

## Scripts

| Comando        | Descrição                        |
| -------------- | -------------------------------- |
| `pnpm dev`     | Inicia o servidor com hot-reload |
| `pnpm build`   | Compila o TypeScript             |
| `pnpm start`   | Roda o build compilado           |
