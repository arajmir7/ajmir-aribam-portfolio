FROM node:24-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
FROM node:24-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ARG NEXT_PUBLIC_SITE_URL
ARG ALLOW_INSECURE_SITE_URL=false
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL
RUN test -n "$NEXT_PUBLIC_SITE_URL" && \
    { [ "$ALLOW_INSECURE_SITE_URL" = "true" ] || [ "${NEXT_PUBLIC_SITE_URL#https://}" != "$NEXT_PUBLIC_SITE_URL" ]; } && \
    npm run build
FROM node:24-alpine
WORKDIR /app
ENV NODE_ENV=production PORT=3000 HOSTNAME=0.0.0.0
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
USER node
EXPOSE 3000
CMD ["node", "server.js"]
