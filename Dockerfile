# ---------------------------------------------------------------------------
# GraphView — Multi-stage Dockerfile
#
# Builds the Storybook component preview and serves it with a lightweight
# Node.js static-file server that exposes GET /health for Graphras
# readiness probes.
#
# Exposed port: 8081
# ---------------------------------------------------------------------------

# -- Stage 1: Build ----------------------------------------------------------
FROM node:20-slim AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build-storybook

# -- Stage 2: Runtime --------------------------------------------------------
FROM node:20-slim AS runtime

RUN groupadd -r graphview && useradd -r -g graphview -m graphview

WORKDIR /app

COPY --from=build /app/storybook-static ./storybook-static
COPY server.mjs ./

USER graphview

EXPOSE 8081

HEALTHCHECK --interval=10s --timeout=3s --start-period=15s --retries=3 \
  CMD node -e "fetch('http://localhost:8081/health').then(r=>{if(!r.ok)process.exit(1)}).catch(()=>process.exit(1))"

CMD ["node", "server.mjs"]
