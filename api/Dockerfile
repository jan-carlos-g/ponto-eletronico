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

# Gera o Prisma Client
RUN npx prisma generate

# Executa as migrações do Prisma
RUN npx prisma migrate deploy

# Expõe a porta que a aplicação irá rodar
EXPOSE 3000

# Comando para iniciar a aplicação
CMD ["yarn", "start"]
