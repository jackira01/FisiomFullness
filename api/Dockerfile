# ==========================================
# ETAPA 1: Dependencias
# ==========================================
FROM oven/bun:1 AS deps
WORKDIR /app

# Copiar los manifiestos de dependencias
COPY package.json bun.lockb ./

# Instalar solo dependencias de producción
RUN bun install --frozen-lockfile --production

# ==========================================
# ETAPA 2: Producción
# ==========================================
FROM oven/bun:1 AS production
WORKDIR /app

# Variables de entorno
ENV NODE_ENV=production
ENV PORT=3000

# Copiar dependencias ya instaladas desde la etapa anterior
COPY --from=deps /app/node_modules ./node_modules

# Copiar el código fuente
COPY server.js ./
COPY src/ ./src/

# Crear el directorio de uploads temporales que usa Multer
RUN mkdir -p uploads

# Seguridad: crear usuario sin privilegios de root
RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 nodeuser \
    && chown -R nodeuser:nodejs /app

USER nodeuser

# Exponer el puerto del backend
EXPOSE 3000

# Iniciar la aplicación
CMD ["bun", "server.js"]
