FROM node:20
WORKDIR /app
COPY backend/package*.json ./backend/pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install
COPY backend/ .
EXPOSE 3000
CMD ["pnpm", "start"]
