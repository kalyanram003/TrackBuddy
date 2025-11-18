@echo off
echo Starting TrackBuddy Backend...
echo.
echo This will start the Spring Boot application on port 8082
echo Using H2 in-memory database (no external setup required)
echo.
echo Press Ctrl+C to stop the server
echo.
mvnw.cmd spring-boot:run
pause
