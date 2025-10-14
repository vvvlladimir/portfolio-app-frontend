# === Base Stage ===
FROM node:24-alpine AS base
WORKDIR /app
COPY package*.json ./

RUN npm ci

# === Build Stage ===
FROM base AS builder
COPY . .
RUN npm run build

# === Production Stage ===
FROM node:24-alpine AS production
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000
CMD ["npm", "start"]