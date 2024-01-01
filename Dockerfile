# Use an official Node.js runtime as the base image
FROM node:16

# Set the working directory in the container to /app
WORKDIR /app

# Install postgresql-client
RUN apt-get update && apt-get install -y postgresql-client

# Copy package.json and package-lock.json into the directory /app in the container
COPY package*.json ./

# Install the application dependencies inside the container
RUN npm install

# Generate the Prisma client
RUN npx prisma generate

# Copy the rest of the application code into the container
COPY . .

# Copy the wait script
COPY wait-for-db.sh ./

# Expose port 4000 for the application
EXPOSE 4000

# Define the command to run the application
CMD bash ./wait-for-db.sh && npm start