FROM node:18

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install

COPY . .
RUN npx prisma generate
RUN npm run build

COPY src/docs ./dist/docs

EXPOSE 5000

CMD ["npm", "start"]