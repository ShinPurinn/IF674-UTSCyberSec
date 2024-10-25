FROM node:20
WORKDIR /app
COPY frontend/package*.json ./frontend/pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install
COPY frontend/ .
RUN pnpm run build
FROM nginx:stable-alpine
COPY --from=0 /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
