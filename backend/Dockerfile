# Build container for Node.js Express Backend API
FROM node:18-alpine

WORKDIR /app

# Copy dependency manifests
COPY package*.json ./

# Install production dependencies
RUN npm ci --only=production

# Copy application source code
COPY . .

EXPOSE 5000

ENV NODE_ENV=production

CMD ["node", "server.js"]
