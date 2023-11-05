# Gym Website Backend

## Project Overview

This is the backend codebase for a gym website. It is built using NestJS, a powerful web framework for building scalable server-side applications. The project also utilizes Prisma as an ORM for PostgreSQL to interact with the database. The authentication is handled using JWT (JSON Web Tokens) through `@nestjs/jwt` and `@nestjs/passport`.

## Project Structure

The project is organized as follows:

- **src**: Contains the source code for the NestJS application.
  - **modules**: Application modules (e.g., authentication, user, membership, posts).
  - **common**: Reusable modules or utilities.
- **prisma**: Prisma configuration and database schema.

## Scripts

- **build**: Build the NestJS application.
- **format**: Format code using Prettier.
- **start**: Start the NestJS application.
- **start:dev**: Start the application in development mode with watch mode.
- **start:debug**: Start the application in debug mode with watch mode.
- **start:prod**: Start the application in production mode.
- **prisma:studio**: Open Prisma Studio for database visualization.
- **prisma:generate**: Generate Prisma client.
- **prisma:mig**: Run database migration and generate Prisma client.

## Dependencies

- **NestJS**: Core modules and libraries for building NestJS applications.
- **Prisma**: Database ORM for PostgreSQL.
- **Passport**: Authentication middleware for NestJS.
- **JWT**: JSON Web Token implementation for NestJS.
- **Argon2**: Password hashing library.
- **Prisma Client**: Auto-generated client for Prisma.
- **Express**: Web application framework.
- **Helmet**: Security middleware.
- **Multer**: File uploading middleware.
- **Nodemailer**: Email sending library.
- **UUID**: Library for generating UUIDs.

## Development Dependencies

- **NestJS CLI**: Command-line interface for NestJS.
- **TypeScript**: Typed superset of JavaScript.
- **ESLint**: Linting utility.
- **Prettier**: Code formatter.
- **Prisma CLI**: Command-line interface for Prisma.

## Database Schema

The database schema includes entities such as User, Membership, UserMembership, Posts, Comments, etc. Users can have memberships, create posts, and leave comments. The schema also handles email changes, password resets, and OTPs for various purposes.

## Getting Started

1. Install dependencies: `npm install` or `pnpm install`.
2. Set up the database URL in the `.env` file.
3. Run database migrations: `npm run prisma:mig`.
4. Generate Prisma client: `npm run prisma:generate`.
5. Start the application in development mode: `npm run start:dev`.

## Database Operations

- Open Prisma Studio: `npm run prisma:studio`.
