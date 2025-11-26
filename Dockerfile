# Stage 1: Build React frontend
FROM node:18 AS frontend-build
WORKDIR /app/frontend

# copy package files first to leverage caching (package-lock.json optional)
COPY Frontend/package*.json ./
RUN npm install

COPY Frontend/ ./
RUN npm run build


# Stage 2: Build Spring Boot backend
FROM eclipse-temurin:21-jdk AS backend-build
WORKDIR /app/backend

COPY Backend/pom.xml .
RUN mvn dependency:go-offline

COPY Backend/ ./

# Copy frontend build into backend static folder
COPY --from=frontend-build /app/frontend/build/ src/main/resources/static/

RUN mvn clean package -DskipTests


# Stage 3: Run the application
FROM openjdk:21-jdk-slim
WORKDIR /app

COPY --from=backend-build /app/backend/target/*.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
