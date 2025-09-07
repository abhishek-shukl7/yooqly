# Use the official Node.js image as the base. We recommend using a specific
# version to ensure consistency across all your deployments.
# This example uses the latest Node.js 20 LTS version.
FROM node:24.2.0-alpine

# Set the working directory inside the container. All subsequent commands
# will be executed from this directory.
WORKDIR /app

# Copy the package.json and package-lock.json files first. This step is
# separated to leverage Docker's build cache. If these files don't change,
# Docker won't re-run 'npm install', which saves a lot of time.
COPY package*.json ./

# Install your application's dependencies. The '--production' flag installs
# only the dependencies listed in 'dependencies' in your package.json,
# which is perfect for a production environment.
RUN npm install --production

# Copy all the rest of your application's source code into the container.
# The '.dockerignore' file (if you create one) will prevent files like
# 'node_modules' from being copied, keeping the image small.
COPY . .

# Expose the port that your Node.js application listens on. Coolify
# needs to know this so it can route traffic to your container.
# Replace 3000 with the port number your app uses (e.g., 5000).
EXPOSE 3001

# Define the command to start your application. This is the final
# command that will be executed when the container starts.
CMD [ "node", "index.js" ]
