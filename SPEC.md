# SPEC — Mars Mission Control Dojo

## Visão Geral

**Projeto:** Mars Mission Control  
**Contexto:** Projeto base para o programa de estágio da V4 Company. Será entregue pronto aos candidatos, que deverão evoluí-lo durante o dojo.  
**Stack:** Node.js + Fastify + Kysely + PostgreSQL (backend) · React + Vite (frontend) · Docker Compose (infra)  
**Objetivo deste documento:** Especificar o projeto base que deve ser construído antes do dojo. Os candidatos receberão este projeto funcionando e deverão adicionar funcionalidades sobre ele.

---

## Contexto do Domínio

O sistema representa o painel de controle da colônia em Marte. A entidade central desta base é `astronauts` — os tripulantes registrados na missão. O projeto base deve ter apenas o módulo de astronautas funcionando, com listagem e criação. Os candidatos serão responsáveis por evoluir este módulo e criar novos.

---

## Arquitetura

```
mars-dojo/
├── docker-compose.yml
├── README.md
├── backend/
│   ├── package.json
│   ├── tsconfig.json
│   ├── .env.example
│   └── src/
│       ├── server.ts              # Entry point, registra plugins e rotas
│       ├── database/
│       │   ├── client.ts          # Instância do Kysely
│       │   └── types.ts           # Tipos do schema do banco (Database interface)
│       ├── modules/
│       │   └── astronauts/
│       │       ├── astronaut.repository.ts
│       │       ├── astronaut.routes.ts
│       │       └── astronaut.schema.ts
│       └── shared/
│           └── pagination.ts      # Helper de paginação reutilizável
└── frontend/
    ├── package.json
    ├── index.html
    └── src/
        ├── main.tsx
        ├── App.tsx
        ├── api/
        │   └── astronauts.ts      # Funções de fetch para a API
        ├── components/
        │   ├── AstronautList.tsx
        │   ├── AstronautForm.tsx
        │   └── Pagination.tsx
        └── types/
            └── astronaut.ts
```

---

## Banco de Dados

### Configuração

- PostgreSQL 15 via Docker
- Porta exposta: `5432`
- Database: `mars`
- Usuário: `mars_user`
- Senha: `mars_password`

> Não há migrations automáticas. O banco sobe limpo e os candidatos criam suas tabelas diretamente via cliente SQL (DBeaver, TablePlus, psql). A tabela `astronauts` deve ser criada pelo próprio script de seed inicial.

### Seed Inicial

O Docker Compose deve executar automaticamente um arquivo `init.sql` que cria e popula a tabela `astronauts`. Este arquivo serve como referência de padrão para os candidatos ao criarem suas próprias tabelas.

### Schema: `astronauts`

```sql
CREATE TABLE astronauts (
  id          SERIAL PRIMARY KEY,
  name        VARCHAR(255) NOT NULL,
  role        VARCHAR(100) NOT NULL,
  nationality VARCHAR(100) NOT NULL,
  status      VARCHAR(50)  NOT NULL DEFAULT 'active',
  deleted_at  TIMESTAMP    DEFAULT NULL,
  created_at  TIMESTAMP    NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMP    NOT NULL DEFAULT NOW()
);
```

**Campo `status`:** valores esperados são `active` e `inactive`.  
**Campo `deleted_at`:** usado para soft delete. Registros com `deleted_at IS NOT NULL` são considerados deletados e não devem aparecer nas listagens.

### Seed de Dados

Inserir ao menos 20 astronautas fictícios com dados variados de `role` e `nationality` para que paginação e filtro possam ser testados com dados reais.

---

## Backend

### Configuração Geral

- Framework: Fastify
- Linguagem: TypeScript
- Query builder: Kysely
- Porta: `3333`
- CORS habilitado para `http://localhost:5173`
- Variáveis de ambiente via `.env` (`.env.example` incluído no repo)

### Variáveis de Ambiente

```env
DATABASE_URL=postgresql://mars_user:mars_password@localhost:5432/mars
PORT=3333
```

### Rota de Saúde

```
GET /health
```

Resposta:
```json
{ "status": "ok", "mission": "Mars Mission Control" }
```

---

### Módulo: Astronauts

#### `GET /astronauts`

Lista os astronautas ativos (onde `deleted_at IS NULL`).

**Query params:**

| Parâmetro | Tipo   | Obrigatório | Descrição                                      |
|-----------|--------|-------------|------------------------------------------------|
| `search`  | string | não         | Filtra por nome (case-insensitive, busca parcial) |
| `page`    | number | não         | Página atual. Default: `1`                     |
| `limit`   | number | não         | Itens por página. Default: `10`. Máximo: `50`  |

**Resposta `200`:**
```json
{
  "data": [
    {
      "id": 1,
      "name": "Valentina Cruz",
      "role": "Commander",
      "nationality": "Brazilian",
      "status": "active",
      "created_at": "2025-01-01T00:00:00.000Z"
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

**Comportamento esperado:**
- Registros com `deleted_at IS NOT NULL` nunca aparecem.
- O filtro `search` aplica `ILIKE '%termo%'` sobre o campo `name`.
- A ordenação padrão é `created_at DESC`.

---

#### `POST /astronauts`

Cria um novo astronauta.

**Body:**
```json
{
  "name": "Valentina Cruz",
  "role": "Commander",
  "nationality": "Brazilian"
}
```

**Validações:**
- `name`: obrigatório, string, mínimo 2 caracteres.
- `role`: obrigatório, string.
- `nationality`: obrigatório, string.
- `status` não é enviado pelo cliente — o backend define como `active` na criação.

**Resposta `201`:**
```json
{
  "id": 21,
  "name": "Valentina Cruz",
  "role": "Commander",
  "nationality": "Brazilian",
  "status": "active",
  "created_at": "2025-02-18T00:00:00.000Z"
}
```

**Resposta `400` (validação):**
```json
{
  "error": "Validation error",
  "details": ["name is required"]
}
```

---

### Padrão do Repositório

O arquivo `astronaut.repository.ts` deve ser escrito de forma clara e servir de referência de padrão para os candidatos. Ele deve expor funções nomeadas (não uma classe), utilizando a instância do Kysely importada de `database/client.ts`.

Exemplo de assinatura esperada:

```ts
export async function findAstronauts(params: FindAstronautsParams): Promise<AstronautsResult>
export async function createAstronaut(data: CreateAstronautData): Promise<Astronaut>
```

---

## Frontend

### Configuração Geral

- Framework: React com Vite
- Linguagem: TypeScript
- Porta de desenvolvimento: `5173`
- Sem biblioteca de UI — estilização com CSS puro ou CSS modules
- Sem biblioteca de estado global — `useState` e `useEffect` são suficientes

### Visual

O layout deve ser simples e funcional. Não é objetivo do projeto base impressionar visualmente — o foco é que o código seja legível e o padrão de componente seja fácil de replicar.

Paleta sugerida: fundo escuro (tema espacial), texto claro, detalhes em laranja ou azul. Um cabeçalho com o nome **Mars Mission Control** é suficiente.

---

### Tela Principal: Lista de Astronautas

**Componentes:**

`AstronautList` — renderiza a tabela de astronautas. Colunas: Nome, Função, Nacionalidade, Status, Data de cadastro.

`AstronautForm` — formulário com os campos `name`, `role` e `nationality`. Ao submeter, faz `POST /astronauts` e atualiza a lista.

`Pagination` — exibe os controles de página (anterior / próxima / indicador de página atual). Recebe `page`, `totalPages` e callbacks de navegação via props.

**Comportamento:**

- Ao carregar a página, busca `GET /astronauts?page=1&limit=10`.
- O campo de busca deve ter debounce de 300ms antes de disparar nova requisição.
- Ao mudar de página, refaz a requisição com o novo `page`.
- Ao criar um astronauta com sucesso, limpa o formulário e recarrega a lista na página 1.
- Estados de loading e erro devem ser tratados e exibidos ao usuário de forma simples (texto, sem componentes elaborados).

---

## Docker Compose

O `docker-compose.yml` deve orquestrar:

**Serviço `db`:**
- Imagem: `postgres:15`
- Monta o arquivo `./database/init.sql` em `/docker-entrypoint-initdb.d/init.sql`
- Porta: `5432:5432`
- Volume persistente para os dados

**Serviço `backend`:**
- Build a partir do `./backend`
- Depende do `db` com healthcheck
- Porta: `3333:3333`
- Recebe as variáveis de ambiente necessárias

**Serviço `frontend`:**
- Build a partir do `./frontend`
- Porta: `5173:5173`
- Depende do `backend`

> Os três serviços devem subir com um único `docker-compose up`.

---

## README do Projeto Base

O README deve ser escrito na perspectiva dos candidatos do dojo. Deve conter:

1. Explicação do contexto (colônia em Marte, Mission Control)
2. Pré-requisitos (Docker, Node.js, cliente SQL)
3. Como subir o ambiente (`docker-compose up`)
4. Estrutura de pastas comentada
5. Schema da tabela `astronauts` documentado (para servir de referência ao criar novas tabelas)
6. Descrição dos endpoints existentes
7. Seção **"Sua missão"** — em branco, a ser preenchida pelo sensei no dia do dojo com os desafios do grupo

---

## Critérios de Aceite do Projeto Base

O projeto base está pronto quando:

- [ ] `docker-compose up` sobe os três serviços sem erros
- [ ] `GET /health` retorna `200`
- [ ] `GET /astronauts` retorna lista paginada com os 20 astronautas do seed
- [ ] `GET /astronauts?search=val` filtra corretamente por nome
- [ ] `GET /astronauts?page=2` retorna a segunda página corretamente
- [ ] `POST /astronauts` com body válido cria e retorna o astronauta
- [ ] `POST /astronauts` com body inválido retorna `400` com mensagem clara
- [ ] O frontend exibe a lista, o formulário e os controles de paginação
- [ ] A busca no frontend tem debounce e dispara a requisição corretamente
- [ ] Criar um astronauta pelo frontend atualiza a lista automaticamente
- [ ] Soft delete (`deleted_at`) está no schema mas **não exposto como endpoint** — será desafio para os candidatos

---

## O Que Não Deve Existir no Projeto Base

Os itens abaixo são **intencionalmente omitidos** para serem desafios dos candidatos:

- Endpoint de soft delete (`DELETE /astronauts/:id`)
- Endpoint de busca por ID (`GET /astronauts/:id`)
- Qualquer tabela além de `astronauts`
- Autenticação ou controle de acesso
- Tratamento de erro global (deixar simples, o candidato pode melhorar)