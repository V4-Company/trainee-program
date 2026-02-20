# INSTRUCTIONS - Mars Mission Control

## Contexto da missão

Ano 2042. A colônia Aurora, em Marte, entra em fase crítica de expansão.  
O centro de operações, chamado **Mars Mission Control**, precisa evoluir rápido para suportar novas frentes de exploração, logística e segurança da tripulação.

Sua equipe recebeu o sistema atual como base. Ele já possui interface e parte da integração pronta, mas ainda faltam módulos essenciais para o controle da operação em tempo real.

Seu objetivo é transformar esse painel em um sistema operacional confiável para a próxima janela de lançamento.

---

## O exercício

Implemente os itens abaixo:

1. **Implementar delete de astronautas com soft delete**  
   - O frontend já está conectado para chamar esse fluxo.  
   - O registro não deve ser removido fisicamente do banco.

2. **Implementar update de astronautas**  
   - O frontend já está conectado para enviar a atualização.

3. **Implementar CRUD de suprimentos e conectar com o frontend**  
   - Substituir o módulo fake por integração real no backend.

4. **Implementar criação de missões com base em astronautas e suprimentos e conectar com o frontend**  
   - A missão deve considerar os vínculos necessários para operação.

---

## Requisitos de banco de dados

Você deve criar as tabelas necessárias no PostgreSQL para suportar os fluxos de:

- astronautas
- suprimentos
- missões
- relacionamentos entre entidades (quando necessário)

Use o `database/init.sql` como base e evolua o schema conforme necessário.

### Gerenciamento do banco

É permitido (e recomendado) usar **DBeaver** para:

- conectar no banco local do projeto
- criar e alterar tabelas
- validar constraints e relacionamentos
- inspecionar dados de teste

Credenciais padrão:

- Host: `localhost`
- Porta: `5432`
- Database: `mars`
- User: `mars_user`
- Password: `mars_password`

---

## Critérios de conclusão

Para considerar o exercício concluído:

- endpoints funcionam conforme esperado
- frontend está conectado aos endpoints reais dos 4 itens
- soft delete de astronautas respeitado nas listagens
- criação de missões válida com astronauta e suprimento
- tabelas e relacionamentos persistidos no banco

Boa missão. Marte depende da sua entrega.
