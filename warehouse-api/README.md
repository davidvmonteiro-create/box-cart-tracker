# WMS Armazém - API REST

API para o sistema de gestão de armazém com MS SQL Server.

## Setup

1. Criar a base de dados no SQL Server Management Studio:
   - Abrir o ficheiro `setup-database.sql` e executar

2. Configurar o ambiente:
```bash
cp .env.example .env
# Editar .env com os dados do teu SQL Server
```

3. Instalar e arrancar:
```bash
npm install
npm start
```

4. Aceder:
   - Local: http://localhost:5000
   - Rede: http://<IP-DO-PC>:5000

## Endpoints

### Auth
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Registar utilizador

### Boxes
- `GET /api/boxes` - Listar caixas
- `POST /api/boxes` - Registar caixa
- `PUT /api/boxes/:id/assign` - Atribuir caixa a carrinho

### Carts
- `GET /api/carts` - Listar carrinhos
- `POST /api/carts` - Criar carrinho
- `PUT /api/carts/:id/assign` - Atribuir carrinho a corredor

### Corridors
- `GET /api/corridors` - Listar corredores
- `POST /api/corridors` - Criar corredor
