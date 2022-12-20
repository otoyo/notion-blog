FROM node:16 AS builder

ARG NOTION_API_SECRET
ARG DATABASE_ID
ARG INDEX_PAGE_ID
ARG SUBSCRIPTION_PAGE_ID
ARG NEXT_PUBLIC_URL
ARG NEXT_PUBLIC_GA_TRACKING_ID

ENV NOTION_API_SECRET=${NOTION_API_SECRET}
ENV DATABASE_ID=${DATABASE_ID}
ENV INDEX_PAGE_ID=${INDEX_PAGE_ID}
ENV SUBSCRIPTION_PAGE_ID=${SUBSCRIPTION_PAGE_ID}
ENV NEXT_PUBLIC_URL=${NEXT_PUBLIC_URL}
ENV NEXT_PUBLIC_GA_TRACKING_ID=${NEXT_PUBLIC_GA_TRACKING_ID}

ENV NODE_ENV=development

WORKDIR /app

COPY package.json ./
COPY yarn.lock ./

RUN yarn install

COPY . .

RUN yarn build


FROM node:16-slim AS runner

ENV NODE_ENV=production

WORKDIR /app

COPY package.json ./
COPY yarn.lock ./

RUN yarn install

COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

CMD ["yarn", "start"]
