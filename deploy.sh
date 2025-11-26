#!/usr/bin/env bash

set -e

# Update these folder names if needed
FRONTEND_DIR="Frontend"
BACKEND_DIR="Backend"
STATIC_DIR="$BACKEND_DIR/src/main/resources/static"

echo "Building frontend..."
cd "$FRONTEND_DIR"
npm install
npm run build
cd ..

echo "Copying frontend build to backend..."
rm -rf "$STATIC_DIR"
mkdir -p "$STATIC_DIR"
cp -r "$FRONTEND_DIR/build/"* "$STATIC_DIR/"

echo "Building Spring Boot application..."
cd "$BACKEND_DIR"
./mvnw clean package -DskipTests

echo "Done!"
echo "Jar file generated at: $BACKEND_DIR/target/"
