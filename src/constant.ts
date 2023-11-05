import * as dotenv from 'dotenv';
dotenv.config();

export const ENV = process.env.ENV || 'development';
export const PORT = process.env.PORT || 3000;

export const DB = {
  USERNAME: process.env.POSTGRES_USER,
  PASSWORD: process.env.POSTGRES_PASSWORD,
  DB: process.env.POSTGRES_DB,
  HOST: process.env.DB_HOST,
  PORT: parseInt(process.env.DB_PORT as string),
  SCHEMA: process.env.DB_SCHEMA,
  URL: process.env.DATABASE_URL,
};

export const JWT = {
  SECRET: process.env.JWT_SECRET,
  EXPIRES_IN: process.env.JWT_EXPIRES_IN,
};

export const SMTP = {
  HOST: process.env.MAILER_HOST,
  PORT: parseInt(process.env.MAILER_PORT as string),
  SECURE: process.env.SECURE_MODE,
  USER: process.env.MAILER_USER,
  PASS: process.env.MAILER_PASSWORD,
};

export const BACKEND_URL = process.env.BACKEND_URL;
export const FRONTEND_URL = process.env.FRONTEND_URL;
