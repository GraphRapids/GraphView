# ---- Build stage ----
FROM node:20-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build-storybook

# ---- Runtime stage ----
FROM node:20-slim AS runtime

RUN groupadd -r graphview && useradd -r -g graphview -m graphview

WORKDIR /app

COPY --from=build /app/storybook-static ./storybook-static
COPY scripts/serve.mjs ./serve.mjs

# GraphView listens on port 8080 (non-privileged)
EXPOSE 8080

HEALTHCHECK --interval=10s --timeout=3s --start-period=15s --retries=3 \
  CMD ["node", "-e", "fetch('http://localhost:8080/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"]

USER graphview

CMD ["node", "serve.mjs"]
