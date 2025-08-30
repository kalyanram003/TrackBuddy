# Track Buddy ✅📅  

## Overview  
**Track Buddy** is a backend application built with **Java Spring Boot** and MySQL that helps you manage tasks, users, and schedules efficiently. It combines essential task management tools with powerful features like PDF reporting, AI-powered prioritization, email notifications, and event-driven alerts. It’s designed with clean architecture, security, and scalability in mind.

**Visit now →** [trackbuddy.onrender.com](trackbuddy.onrender.com)

## Features  
👥 **User Management** — Create, update, and manage users, with support for roles, permissions, and authentication via JWT.

📝 **Task Management** — Add, update, delete, and fetch tasks.

🔍 **Basic Task Filtering** — Quickly filter tasks by status, due date, or assigned user.

🏷️ **Tagging & Categories** — Organize tasks with tags and categories for better searchability.

📄 **PDF Report Generation** — Export task lists or filtered results into professional PDF reports.

🗄️ **Database Integration** — MySQL database with JPA for persistence.

📧 **Email Notifications** — Automatically send task reminders or updates via email.

⏳ **Scheduling** — Schedule recurring tasks and reminders.

📊 **Improved Task Metadata** — Store additional details like priority, estimated completion time, and dependencies.

🤖 **AI Assistance** — Get task prioritization suggestions and productivity tips based on your task list.

🔐 **JWT Authentication** — Secure APIs with token-based authentication.

⚡ **Event-Driven Alerts** — Real-time alerts triggered by task deadlines or status changes.

📜 **API Documentation** — Fully documented REST APIs with Swagger for easy testing.

## Tech Stack  
**Backend**              : Java 17, Spring Boot, Spring Data JPA

**Database**             : MySQL (Production) and H2 (Testing)

**PDF Generation**       : iText

**Scheduling**           : Spring Scheduler

**Email**                : JavaMailSender

**AI Assistance**        : Custom AI Service Integration

**Authentication**       : JWT

**API Docs**             : Springdoc OpenAPI (Swagger UI)

**Build Tool**           : Maven

**Version Control**      : Git, GitHub


## Project Structure

**src/
 
 ├── controller/    --> Exposes REST APIs
 
 ├── service/       --> Business logic
 
 ├── repository/    --> Database access (JPA)

 ├── Enums/         --> Enum classes
 
 ├── model/         --> Entity classes
 
 ├── Scheduler/     --> Scheduler class
 
 └── util/          --> Utility classes for PDF generation, API integration


 ## Setup Instructions

**Clone the repository**  :  git clone https://github.com/kalyanram003/TrackBuddy.git 

**Build the project**      :  ./mvnw clean install 

**Run the application**    :  ./mvnw spring-boot:run

**Access the APIs at**     :  http://localhost:8080/...


## Important APIs

Endpoint                             ------>   Description
POST /api/users                      ------>   	Add a new user
POST /api/tasks                      ------>   	Create a new task
GET /api/tasks                       ------>   	Fetch all tasks (with filters)
GET /api/tasks/{id}                  ------>   	Fetch task by ID
GET /api/tasks/pdf                   ------>   	Generate and download task list PDF
POST /api/auth/login                 ------>   	User login (JWT)
GET /api/docs                        ------>   	Swagger UI for API documentation
