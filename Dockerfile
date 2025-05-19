# Etapa 1: build da aplicação
FROM node:22.15-slim

WORKDIR /app

# Copia os arquivos de dependência
COPY yarn.lock package.json ./

# Instala as dependências
RUN yarn install --frozen-lockfile

# Copia o restante do código
COPY . .

# Compila a aplicação para produção
RUN yarn build

CMD ["yarn", "start", "-p", "3001"]
