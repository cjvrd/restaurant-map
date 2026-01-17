FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=development

# Accept build argument for Mapbox token
ARG VITE_MAPBOX_ACCESS_TOKEN
ENV VITE_MAPBOX_ACCESS_TOKEN=${VITE_MAPBOX_ACCESS_TOKEN}

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