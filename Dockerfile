FROM matdombrock/ubuntu-base:latest
WORKDIR /usr/src/app
EXPOSE 80 8080 443 3000 3001
RUN apt update -y
# Install deps
# ...
# Copy local build data to image
COPY . .
# Start mysql server
CMD ./setup.sh