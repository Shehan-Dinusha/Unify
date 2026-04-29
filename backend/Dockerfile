
# Use Node.js LTS (Long Term Support) version
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port the app runs on
EXPOSE 5000

# Command to run the application
# We use nodemon for development (defined in package.json as "dev" script)
CMD ["npm", "run", "dev"]
