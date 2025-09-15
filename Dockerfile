
# Dockerfile for chris-freg-ang (Angular) - ARM64 optimized
FROM --platform=linux/arm64 node:18.19-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build -- --configuration production

FROM --platform=linux/arm64 nginx:alpine
COPY --from=build /app/dist/chris-freg /usr/share/nginx/html

# Custom nginx config for Angular SPA
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
