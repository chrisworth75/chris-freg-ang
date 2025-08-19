
# ---- build stage ----
FROM node:20-alpine AS build
WORKDIR /app

ENV CI=true NG_CLI_ANALYTICS=false
COPY package*.json ./
RUN npm ci

COPY . .
# Build prod (adjust if your script differs)
RUN npm run build -- --configuration production

# ---- runtime (nginx) ----
FROM nginx:alpine

# SPA routing so deep links work
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Set your Angular project name here (folder under dist/)
# For Angular 16/17: output is dist/<APP_NAME>/browser/
ARG APP_NAME=chris-freg
COPY --from=build /app/dist/${APP_NAME}/browser/ /usr/share/nginx/html/

# Optional: if you're on older Angular (<15), use this COPY instead:
# COPY --from=build /app/dist/${APP_NAME}/ /usr/share/nginx/html/

EXPOSE 80
HEALTHCHECK CMD wget -qO- http://localhost/ >/dev/null 2>&1 || exit 1
CMD ["nginx", "-g", "daemon off;"]
