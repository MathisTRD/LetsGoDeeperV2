FROM node:22-alpine

WORKDIR /app

# Ensure Next.js binds to the container network interface
ENV HOSTNAME=0.0.0.0
ENV PORT=3000

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy application code (excluding sensitive files via .dockerignore)
COPY src/ ./src/
COPY public/ ./public/
COPY next.config.js ./
COPY tsconfig.json ./

# Build the application
RUN npm run build

# Expose port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]