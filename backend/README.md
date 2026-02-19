# Mars Mission Control — Backend

API REST para gerenciamento de astronautas da missão Mars Mission Control.

## Tecnologias

- **Fastify** — framework HTTP
- **Kysely** — query builder TypeScript
- **PostgreSQL** — banco de dados
- **TypeScript** — linguagem

## Configuração

1. Instale as dependências:

```bash
pnpm install
```

2. Crie um arquivo `.env` na raiz do backend:

```
DATABASE_URL=postgresql://usuario:senha@localhost:5432/mars_mission
PORT=3333
```

3. Inicie o servidor em modo desenvolvimento:

```bash
pnpm dev
```

O servidor estará disponível em `http://localhost:3333`.

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
# atualizar role e status (substitua 1 pelo id real)
curl -X PUT http://localhost:3333/astronauts/1 \
  -H "Content-Type: application/json" \
  -d '{
    "role": "Engenheiro de Voo",
    "status": "inactive"
  }'
```

```bash
# atualizar apenas o nome
curl -X PUT http://localhost:3333/astronauts/1 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Marcos César Pontes"
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
