# Backend Challenge – Orders API

API backend desenvolvida em **Node.js + TypeScript** para gerenciamento de pedidos, com autenticação JWT e persistência em MongoDB.

---

## Stacks Utilizada

- Node.js
- Express
- TypeScript
- Zod
- MongoDB
- Mongoose
- JWT
- Docker & Docker Compose
- Vitest

---

## 🏗 Arquitetura

O projeto segue **Feature-Based Architecture**, onde cada domínio possui sua própria organização:

```
src/
├── http/
│ ├── app.ts
│ ├── server.ts
│ └── routes.ts
├── infrastructure/
│ ├── database/
├── middlewares/
├── modules/
│ ├── auth/
│ ├── orders/
│ └── users/
├── shared/
│ ├── errors/
│ └── utils/
└── index.ts`
```

---

## ⚙️ Pré-requisitos

- Node.js (>= 20)
- Docker

---

## 🐳 Subindo o MongoDB com Docker

#### O MongoDB é executado via Docker para **facilitar tanto o desenvolvimento quanto a avaliação do projeto**.

Para subir o banco de dados, na raiz do projeto rode o comando:

```bash
docker-compose up -d
```

MongoDB ficará disponível em:

```
mongodb://localhost:27017
```

## ⚙️ Configuração do projeto

### 1️⃣ Clonar o repositório

```
git clone https://github.com/joelrodriguesvieira/order-managament-challenge.git
cd https://github.com/joelrodriguesvieira/order-managament-challenge.git
```

### 2️⃣ Instalar dependências

```
npm install
```

### 3️⃣ Criar arquivo .env

```
# PORT
PORT=3333

# JWT_SECRET
JWT_SECRET=super-secret-key

# DATABASE_URL
DB_USER=root
DB_PASSWORD=root
DATABASE=mongodb://root:root@localhost:27017/app_db?authSource=admin
```

### 4️⃣ Rodar a aplicação

```
npm run dev
```

### A API ficará disponível em:

```
http://localhost:3333
```

## 🔐 Autenticação

### 📌 Registro

```
POST /api/auth/register
```

### Body:

```
{
  "email": "user@email.com",
  "password": "123456"
}

```

### 📌 Login

```
POST /api/auth/login
```

### Body:

```
{
  "email": "user@email.com",
  "password": "123456"
}
```

### ✅ Resposta (Register / Login)

```
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### ⚠️ O token deve ser enviado nas próximas requisições no header:

```
Authorization: Bearer <token>
```

## 📦 Pedidos (Orders)

### 🔒 Todas as rotas de pedidos exigem autenticação JWT

### ➕ Criar Pedido

```
POST /api/orders
```

### Body:

```
{
  "lab": "Lab ABC",
  "patient": "João Silva",
  "customer": "Hospital Central",
  "services": [
    {
      "name": "Nova Arcária Dentária",
      "value": 150
    }
  ]
}
```

## 📄 Listar Pedidos

### Query Params:

- page number (default: 1)
- limit number (default: 10)
- state CREATED | ANALYSIS | COMPLETED (default: CREATED)

### Exemplo:

```
GET /api/orders?page=1&limit=10&state=CREATED
```

Caso não seja informado **NENHUM** params, ele fará essa busca acima, mas pode se testar com qualquer params.

### Segue outro exemplo:

```
GET /api/orders?page=1&limit=5&state=ANALYSIS
```

## 🔄 Avançar Estado do Pedido

```
PATCH /api/orders/:id/advance
```

### Body:

```
{
  "newState": "ANALYSIS",
}
```

## 🧪 Testes

Testes unitários desenvolvidos com Vitest, focando nas regras de negócio.

### Para rodar os testes:

```
npm run test
```

### Para rodar os testes em modo 'watch':

```
npm run test:watch
```

### Para rodar os testes com métricas detalhadas:

```
npm run test:coverage
```
