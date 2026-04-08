FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN rm -rf .output .vinxi && npm run build

FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000
ENV NITRO_HOST=0.0.0.0
ENV NITRO_PORT=3000

COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=builder /app/.output ./.output

EXPOSE 3000

CMD ["npm", "run", "start"]
