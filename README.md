# **Travels Shopper**

Uma aplicação simples para gerenciar viagens, permitindo buscar motoristas cadastrados com base em critérios de origem, destino e validação de kilometragem mínima. Após selecionar o motorista, o histórico de viagens é exibido.

---

## **Índice**

- [Funcionalidades](#funcionalidades)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Pré-requisitos](#pré-requisitos)
- [Rodando a Aplicação com Docker](#rodando-a-aplicação-com-docker)
- [Rodando a Aplicação Localmente](#rodando-a-aplicação-localmente)
- [Estrutura do Projeto](#estrutura-do-projeto)

---

## **Funcionalidades**

1. Tela inicial para **buscar viagens**:
   - Insira o ID do cliente, origem e destino.
   - Clique em "Buscar Motorista" para verificar motoristas disponíveis.
   - Validação baseada na kilometragem mínima exigida pelo motorista.
2. Tela de **histórico de viagens**:
   - Exibe as viagens anteriores registradas no sistema.

---

## **Tecnologias Utilizadas**

- **Backend**: [Fastify](https://www.fastify.io/) + [Prisma](https://www.prisma.io/)
- **Frontend**: [React](https://reactjs.org/) com [Vite](https://vitejs.dev/) e TypeScript
- **Gerenciamento de Pacotes**: Yarn
- **Banco de Dados**: SQLite
- **Containerização**: Docker e Docker Compose

---

## **Pré-requisitos**

Certifique-se de ter as seguintes ferramentas instaladas:

- [Docker](https://www.docker.com/) e [Docker Compose](https://docs.docker.com/compose/)
- [Node.js](https://nodejs.org/) (v18 ou superior)
- [Yarn](https://yarnpkg.com/)

---

## **Rodando a Aplicação com Docker**

### **Passo 1: Configuração**

1. Clone o repositório para sua máquina:

   ```bash
   git clone <URL_DO_REPOSITORIO>
   cd travels-shopper
   ```

2. Certifique-se de que o Docker está em execução.

### **Passo 2: Construção e Execução**

1. Execute o comando abaixo para construir e rodar os contêineres:

   ```bash
   docker compose up --build
   ```

2. Acesse os serviços:
   - **Frontend**: [http://localhost:80](http://localhost:80)
   - **Backend**: [http://localhost:8080](http://localhost:8080)

> **Nota**: Durante a inicialização, o banco de dados será populado automaticamente com os dados de seed.

---

## **Rodando a Aplicação Localmente**

### **Passo 1: Configuração do Backend**

1. Navegue até a pasta do servidor:

   ```bash
   cd server
   ```

2. Instale as dependências:

   ```bash
   yarn
   ```

3. Configure o banco de dados:

   - Certifique-se de que o arquivo `DATABASE_URL` em `prisma/schema.prisma` está apontando para o caminho correto:
     ```
     DATABASE_URL="file:./data/database.db"
     ```

4. Execute as migrações e o seed:

   ```bash
   yarn prisma migrate dev
   yarn prisma:seed
   ```

5. Inicie o servidor:

   ```bash
   yarn dev
   ```

6. O servidor estará rodando em [http://localhost:8080](http://localhost:8080).

---

### **Passo 2: Configuração do Frontend**

1. Navegue até a pasta do frontend:

   ```bash
   cd travel
   ```

2. Instale as dependências:

   ```bash
   yarn
   ```

3. Inicie a aplicação:

   ```bash
   yarn dev
   ```

4. Acesse o frontend em [http://localhost:5173](http://localhost:5173).

---

## **Estrutura do Projeto**

```plaintext
travels-shopper/
├── server/                 # Backend (Fastify + Prisma)
│   ├── prisma/             # Configurações do Prisma e schema
│   ├── src/                # Código fonte do backend
│   ├── package.json        # Dependências do backend
│   ├── Dockerfile          # Configuração do Docker para o backend
│   └── ...
├── travel/                 # Frontend (React + Vite)
│   ├── src/                # Código fonte do frontend
│   ├── vite.config.ts      # Configurações do Vite
│   ├── Dockerfile          # Configuração do Docker para o frontend
│   └── ...
├── docker-compose.yml      # Configuração do Docker Compose
└── README.md               # Documentação do projeto
```

---
