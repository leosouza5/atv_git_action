# ---------- Stage 1: test ----------
FROM node:22-alpine AS test
WORKDIR /app

# Instala dependências do sistema que o npm possa precisar (opcional)
RUN apk add --no-cache python3 make g++

# Copia manifests primeiro para aproveitar cache
COPY package.json package-lock.json* ./
RUN npm ci

# Copia o restante do código
COPY . .

# Executa testes (se falhar, o build falha)
RUN npm test -- --ci

# ---------- Stage 2: production ----------
FROM node:22-alpine AS prod
WORKDIR /app

# Só dependências de produção
COPY package.json package-lock.json* ./
RUN npm ci --omit=dev

# Copia app (não traz testes)
COPY src ./src

# Define porta e comando
ENV PORT=3000
EXPOSE 3000
CMD ["node", "src/index.js"]
