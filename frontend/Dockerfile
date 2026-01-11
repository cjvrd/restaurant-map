FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=development

# Install dependencies (cached if package files unchanged)
COPY package.json package-lock.json ./
RUN npm ci

# Copy source and build
COPY . .
RUN npm run build

# Expose the SSR port and start the server
ENV PORT=5173
EXPOSE 5173
CMD ["npx", "react-router-serve", "./build/server/index.js"]