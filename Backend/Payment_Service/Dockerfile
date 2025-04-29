FROM node:18

# Create and set working directory
WORKDIR /usr/src/app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy application source
COPY . .

# Expose your server port
EXPOSE 3005

# Start the service
CMD ["node", "server.js"]
