# Dockerfile for MERN Backend
FROM node:18-alpine

# Set working directory
WORKDIR /usr/src/app

# Install dependencies
COPY package*.json ./
RUN npm install

# Bundle app source
COPY . .

# Expose backend API port
EXPOSE 5000

# Start command
CMD ["npm", "start"]
