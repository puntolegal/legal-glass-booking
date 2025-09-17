# Build stage
FROM node:20-alpine as builder

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy custom nginx config
COPY nginx.conf /etc/nginx/nginx.conf

# Copy built application
COPY --from=builder /app/dist /usr/share/nginx/html

# Add labels for Punto Legal Apuntes
LABEL maintainer="Punto Legal Apuntes <puntolegalelgolf@gmail.com>"
LABEL description="Plataforma de estudio legal inteligente - Punto Legal Apuntes"
LABEL version="1.0.0"

# Expose port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost/ || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"] 