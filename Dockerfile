# Dockerfile for MERN Frontend
FROM node:20-alpine AS build

# Pass the API URL arg into the build environment
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source and build the Vite React app
COPY . .
RUN npm run build

# Serve with Nginx
FROM nginx:alpine

# Remove default nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy our custom nginx configuration to fix SPA 404 routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy build artifacts to nginx server
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
