# Build Spring Boot backend only
FROM maven:3.9.6-eclipse-temurin-21 AS backend-build
WORKDIR /app/backend

# Copy only maven files first to leverage layer caching
COPY Backend/pom.xml .
RUN mvn dependency:go-offline

# Copy backend source
COPY Backend/ ./

# Build the project (skip tests for faster builds in CI by default)
RUN mvn clean package -DskipTests

# Runtime image
FROM eclipse-temurin:21-jre
WORKDIR /app

# Copy built jar from the backend build stage
COPY --from=backend-build /app/backend/target/*.jar app.jar

EXPOSE 8082
ENTRYPOINT ["java", "-jar", "app.jar"]
