# Movie Watchlist API

A RESTful backend API built with Node.js, Express.js, Prisma, and PostgreSQL.

This project demonstrates authentication, authorization, request validation, relational database design, and CRUD operations through a movie watchlist application.

## Tech Stack

- Node.js
- Express.js
- PostgreSQL
- Prisma ORM
- JWT Authentication
- Zod Validation
- bcryptjs

## Skills Demonstrated

- REST API Design
- Authentication & Authorization
- Database Modeling
- Prisma ORM
- Express Middleware
- Input Validation
- CRUD Operations

## Architecture

```text
src
├── config          # Database and environment configuration
├── controllers     # Request handling and business logic
├── middleware      # Authentication and validation middleware
├── routes          # API route definitions
├── utils           # Shared helper functions
└── validators      # Zod validation schemas

prisma
├── migrations      # Database migration history
├── schema.prisma   # Database schema
└── seed.js         # Sample data seeding
```

## Features

- User registration and login
- JWT authentication
- Protected watchlist routes
- Add, update, and remove watchlist items
- PostgreSQL database with Prisma ORM
- Request validation using Zod

## Local Setup

```bash
npm install
npx prisma migrate dev
npm run dev
```
