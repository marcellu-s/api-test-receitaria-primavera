# api-test-receitaria-primavera

> API de teste local, criada para o aplicativo mobile Receitaria Primavera

## Técnologias utilizadas:

- Node.JS
- Express.JS
- MongoDB Atlas

## Instalação e Execução
Siga os passos abaixo para clonar, instalar dependências e executar o aplicativo:

### Pré-requisitos
- Node.js: Certifique-se de ter o [Node.js](https://nodejs.org/) instalado em sua máquina.
- MongoDB: Necessário uma conta no [MongoDB Atlas](https://www.mongodb.com/atlas/database)

```bash
# Clone este repositório
git clone https://github.com/marcellu-s/api-test-receitaria-primavera.git

# Navegue para o diretório do projeto
cd api-test-receitaria-primavera

# Crie um arquivo .env (Windows) - Certifique-se de ter a string de conexão do MongoDB Atlas em mãos
echo MONGODB_CONNECT_URI=*string de conexão* > .env

# Crie um SECRET no .env, exemplo abaixo:
SECRET=w5f4w56f4w89fwf4cwf4w6f

# Instale as dependências do projeto
npm install

# Inicie o aplicativo
npm start
