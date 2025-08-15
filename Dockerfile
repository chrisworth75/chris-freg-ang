
# --- build stage ---
FROM node:20-alpine AS build
WORKDIR /app
ENV CI=true NG_CLI_ANALYTICS=false
COPY package*.json ./
RUN npm ci
COPY . .
# prefer project-specific build script (no global ng)
RUN npm run build

# --- serve stage ---
FROM nginx:alpine
COPY --from=build /app/dist/ /usr/share/nginx/html/
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
