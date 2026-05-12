# API do Yearbook — Documentação de Endpoints

Base URL (produção):

```txt
https://yearbook-backend.vercel.app
```

---

# Convenções

- Todas as respostas são em JSON
- Rotas protegidas exigem:

```http
Authorization: Bearer <token>
```

- O campo `senhaHash` nunca é retornado
- Erros seguem o padrão:

```json
{
  "erro": "mensagem descritiva"
}
```

---

## Auth

### POST /auth/register

Cria uma nova conta de aluno.

- **Autenticação:** Não

- **Body:**

```json
{
  "nome": "Maria Silva",
  "email": "maria@email.com",
  "senha": "minhasenha123",
  "cidade": "Salinas",
  "frase": "Aqui começa o futuro.",
  "planosFuturos": "Cursar Ciência da Computação na UFMG"
}
```

- **Resposta de sucesso:** `201 Created`

```json
{
  "id": 1,
  "nome": "Maria Silva",
  "email": "maria@email.com",
  "cidade": "Salinas",
  "frase": "Aqui começa o futuro.",
  "planosFuturos": "Cursar Ciência da Computação na UFMG",
  "fotoUrl": null,
  "role": "USER",
  "criadoEm": "2026-04-03T10:30:00.000Z"
}
```

- **Erros:**
  - `400` — Campos obrigatórios ausentes
  - `409` — Email já cadastrado

---

### POST /auth/login

Autentica um aluno e retorna um token JWT.

- **Autenticação:** Não

- **Body:**

```json
{
  "email": "maria@email.com",
  "senha": "minhasenha123"
}
```

- **Resposta de sucesso:** `200 OK`

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

- **Erros:**
  - `401` — Credenciais inválidas (email não existe ou senha incorreta)

---

## Alunos

### GET /alunos

Lista todos os alunos cadastrados.

- **Autenticação:** Não
- **Body:** Nenhum

- **Resposta de sucesso:** `200 OK`

```json
[
  {
    "id": 1,
    "nome": "Maria Silva",
    "email": "maria@email.com",
    "cidade": "Salinas",
    "frase": "Aqui começa o futuro.",
    "planosFuturos": "Cursar Ciência da Computação na UFMG",
    "fotoUrl": "https://site.com/foto.jpg",
    "role": "USER",
    "criadoEm": "2026-04-03T10:30:00.000Z"
  }
]
```

- **Erros:**
  - Nenhum erro específico

---

### GET /alunos/:id

Busca um aluno pelo ID.

- **Autenticação:** Não
- **Body:** Nenhum

- **Resposta de sucesso:** `200 OK`

```json
{
  "id": 1,
  "nome": "Maria Silva",
  "email": "maria@email.com",
  "cidade": "Salinas",
  "frase": "Aqui começa o futuro.",
  "planosFuturos": "Cursar Ciência da Computação na UFMG",
  "fotoUrl": "https://site.com/foto.jpg",
  "role": "USER",
  "criadoEm": "2026-04-03T10:30:00.000Z"
}
```

- **Erros:**
  - `404` — Aluno não encontrado

---

### PUT /alunos/:id

Atualiza os dados do próprio perfil.

- **Autenticação:** Bearer token

- **Body:**

```json
{
  "nome": "Maria Silva",
  "cidade": "Salinas",
  "frase": "Novo começo, novos sonhos.",
  "planosFuturos": "Estudar Engenharia de Software",
  "fotoUrl": "https://site.com/nova-foto.jpg"
}
```

- **Resposta de sucesso:** `200 OK`

```json
{
  "id": 1,
  "nome": "Maria Silva",
  "email": "maria@email.com",
  "cidade": "Salinas",
  "frase": "Novo começo, novos sonhos.",
  "planosFuturos": "Estudar Engenharia de Software",
  "fotoUrl": "https://site.com/nova-foto.jpg",
  "role": "USER",
  "criadoEm": "2026-04-03T10:30:00.000Z"
}
```

- **Erros:**
  - `401` — Usuário não autenticado
  - `403` — Sem permissão para alterar outro perfil
  - `404` — Aluno não encontrado

---

### DELETE /alunos/:id

Remove um aluno do sistema.

- **Autenticação:** Bearer token (admin)
- **Body:** Nenhum

- **Resposta de sucesso:** `204 No Content`

- **Erros:**
  - `401` — Usuário não autenticado
  - `403` — Apenas administradores podem excluir alunos
  - `404` — Aluno não encontrado

---

## Mensagens

### GET /mensagens

Lista todas as mensagens do mural.

- **Autenticação:** Não
- **Body:** Nenhum

- **Resposta de sucesso:** `200 OK`

```json
[
  {
    "id": 1,
    "texto": "Nunca desistam dos seus sonhos 🚀",
    "imagemUrl": "https://site.com/imagem.jpg",
    "autorId": 1,
    "criadoEm": "2026-04-03T10:30:00.000Z",
    "autor": {
      "id": 1,
      "nome": "Maria Silva",
      "fotoUrl": "https://site.com/foto.jpg"
    }
  }
]
```

- **Erros:**
  - Nenhum erro específico

---

### POST /mensagens

Cria uma nova mensagem no mural.

- **Autenticação:** Bearer token

- **Body:**

```json
{
  "texto": "Nunca desistam dos seus sonhos 🚀",
  "imagemUrl": "https://site.com/imagem.jpg"
}
```

> ⚠️ O campo `autorId` não deve ser enviado no body.
> O back-end identifica o usuário autenticado automaticamente através do token JWT.

- **Resposta de sucesso:** `201 Created`

```json
{
  "id": 1,
  "texto": "Nunca desistam dos seus sonhos 🚀",
  "imagemUrl": "https://site.com/imagem.jpg",
  "autorId": 1,
  "criadoEm": "2026-04-03T10:30:00.000Z"
}
```

- **Erros:**
  - `400` — Campo `texto` obrigatório
  - `401` — Usuário não autenticado

---

### DELETE /mensagens/:id

Exclui uma mensagem do mural.

- **Autenticação:** Bearer token
- **Body:** Nenhum

- **Resposta de sucesso:** `204 No Content`

- **Erros:**
  - `401` — Usuário não autenticado
  - `403` — Apenas o dono da mensagem ou um ADMIN pode excluir
  - `404` — Mensagem não encontrada