# ================================
# Stage 1: Build
# ================================
FROM node:20-alpine AS builder
WORKDIR /app

# نسخ ملفات package.json فقط لتثبيت dependencies
COPY package*.json ./
RUN npm ci

# نسخ بقية المشروع
COPY . .

# تحديد متغير البيئة أثناء البناء
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

# بناء المشروع وإزالة devDependencies
RUN npm run build && npm prune --production

# ================================
# Stage 2: Production
# ================================
FROM node:20-alpine AS runner
WORKDIR /app

# إنشاء المستخدم غير الجذر
RUN addgroup -S app && adduser -S app -G app

# نسخ الملفات الضرورية فقط للتشغيل
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# إنشاء مجلد الكاش مع صلاحيات كتابة للمستخدم app
RUN mkdir -p .next/cache/images && chown -R app:app .next/cache

ENV NODE_ENV=production
ENV PORT=3000

USER app
EXPOSE $PORT

CMD ["npx", "next", "start", "-p", "3000"]
