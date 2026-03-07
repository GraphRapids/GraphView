# ---- Build stage ----
FROM node:20-slim AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build-storybook

# ---- Runtime stage ----
FROM node:20-slim AS runtime

LABEL org.opencontainers.image.title="GraphView" \
      org.opencontainers.image.description="GraphRapids GraphView Storybook server" \
      org.opencontainers.image.source="https://github.com/GraphRapids/GraphView"

WORKDIR /app

# Create non-root user
RUN groupadd -r graphview && useradd -r -g graphview -m graphview

# Copy only runtime artifacts — no devDependencies, no source
COPY --from=build /app/storybook-static ./storybook-static
COPY --from=build /app/server.mjs ./server.mjs
COPY --from=build /app/package.json ./package.json

# Switch to non-root user
USER graphview

# Document the exposed port (non-privileged, >=1024)
# GraphView uses port 6006 by default (configurable via PORT env var)
EXPOSE 6006

HEALTHCHECK --interval=10s --timeout=5s --start-period=15s --retries=3 \
  CMD node -e "fetch('http://localhost:6006/health').then(r=>{process.exit(r.ok?0:1)}).catch(()=>process.exit(1))"

CMD ["node", "server.mjs"]
