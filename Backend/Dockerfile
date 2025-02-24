# Use a base image with Java 17+ (or your version)
FROM openjdk:17-jdk-slim

# Set the working directory in the container
WORKDIR /app

# Copy the built JAR file into the container
COPY target/*.jar app.jar

# Expose the port Spring Boot is running on
EXPOSE 8080

# Run the application
CMD ["java", "-jar", "app.jar"]