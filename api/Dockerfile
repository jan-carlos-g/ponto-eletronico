# Use a imagem oficial do Node.js como base
FROM node:18-alpine

# Define o diretório de trabalho dentro do container
WORKDIR /usr/src/app

# Copia o arquivo package.json e yarn.lock para o diretório de trabalho
COPY package*.json yarn.lock ./

# Instala as dependências do projeto
RUN yarn install

# Copia o restante dos arquivos do projeto para o diretório de trabalho
COPY . .
RUN  docker-compose ps
# Gera o Prisma Client
RUN npx prisma generate

# Expõe a porta que a aplicação irá rodar
EXPOSE 3000

# Comando para iniciar a aplicação, incluindo as migrações
CMD npx prisma migrate deploy && yarn start && yarn seed
