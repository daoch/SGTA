# Usar una imagen oficial de Node.js como base
FROM node:18-alpine

# Definir el directorio de trabajo en el contenedor
WORKDIR /app

# Copiar el package.json y el package-lock.json (o pnpm-lock.yaml)
COPY package*.json ./

# Instalar las dependencias usando pnpm
RUN npm install -g pnpm && pnpm install

# Copiar el resto del código al contenedor
COPY . .

# Construir la aplicación Next.js
#RUN pnpm build

# Exponer el puerto en el que Next.js corre por defecto
EXPOSE 3000

# Comando para ejecutar la aplicación
CMD ["pnpm", "dev"]
