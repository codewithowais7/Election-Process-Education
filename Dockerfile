FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install a lightweight static file server
RUN npm install -g http-server

# Copy application files
COPY . .

# Expose port (Cloud Run default)
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s \
  CMD wget -qO- http://localhost:8080/ || exit 1

# Start the static file server
CMD ["http-server", "-p", "8080", "--cors", "-c-1", "--gzip"]
