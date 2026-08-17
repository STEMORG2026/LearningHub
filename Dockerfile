# Multi-stage build for STEM-TUITION shell app
# Stage 1: Build the static site
FROM node:20-alpine AS builder

WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@11.18.0 --activate

# Copy workspace files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
COPY packages ./packages
COPY apps/shell/package.json ./apps/shell/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source
COPY apps/shell ./apps/shell

# Build shell app
RUN pnpm --filter @stem-tuition/shell build

# Stage 2: Serve with nginx
FROM nginx:alpine AS runtime

# Copy static build
COPY --from=builder /app/apps/shell/dist /usr/share/nginx/html

# Custom nginx config for SPA routing
RUN echo 'server { \
    listen 80; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html; \
        try_files $uri $uri/ /index.html; \
    } \
    location /assets/ { \
        expires 1y; \
        add_header Cache-Control "public, immutable"; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
