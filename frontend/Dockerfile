# ---------- Etapa 1: build del export estático ----------
FROM node:22-alpine AS build
WORKDIR /app

RUN apk add --no-cache libc6-compat \
 && corepack enable \
 && corepack prepare pnpm@latest --activate

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml* ./
RUN pnpm install --frozen-lockfile

COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
# next build fuerza NODE_ENV=production, por lo que activa output: "export"
RUN pnpm build

# ---------- Etapa 2: Nginx sirviendo out/ ----------
FROM nginx:stable-alpine
COPY --from=build /app/out /usr/share/nginx/html
COPY nginx/default.conf.template /etc/nginx/templates/default.conf.template
EXPOSE 80