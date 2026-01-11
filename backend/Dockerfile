FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=development

# Install dependencies (cached if package files unchanged)
COPY package.json package-lock.json ./
RUN npm ci

# Copy source and generate Prisma client
COPY . .
RUN npx prisma generate

ENV PORT=3000
EXPOSE 3000

CMD ["npm", "start"]