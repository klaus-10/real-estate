# Use an official Node.js runtime as a parent image
# Consider using a multi-stage build for smaller image size
FROM node:lts-alpine

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install Node.js dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Expose the port the app runs on (internal port)
EXPOSE 3000

# Command to run the application
CMD ["npm", "start"]
