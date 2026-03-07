# Stage 1: Build
FROM node:20-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build-storybook

# Stage 2: Runtime (slim, non-root)
FROM node:20-slim
WORKDIR /app

RUN addgroup --system graphview && adduser --system --ingroup graphview graphview

COPY --from=build /app/storybook-static ./storybook-static
COPY server.mjs ./

USER graphview

# Exposed port — see docs/adr/002 for port convention
EXPOSE 8080

HEALTHCHECK --interval=10s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e 'fetch("http://localhost:8080/health").then(r=>{process.exit(r.ok?0:1)}).catch(()=>process.exit(1))'

CMD ["node", "server.mjs"]
