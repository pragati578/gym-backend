-- CreateEnum
CREATE TYPE "OTPType" AS ENUM ('EMAIL_VERIFICATION', 'PASSWORD_RESET', 'EMAIL_CHANGE', 'OTHER');

-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('ADMIN', 'USER');

-- CreateTable
CREATE TABLE "EmailChange" (
    "otp" TEXT NOT NULL,
    "newEmail" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "validUntil" TIMESTAMP(6) NOT NULL DEFAULT (timezone('utc'::text, now()) + '2 days'::interval),

    CONSTRAINT "EmailChange_pkey" PRIMARY KEY ("otp")
);

-- CreateTable
CREATE TABLE "PasswordReset" (
    "otp" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "validUntil" TIMESTAMP(6) NOT NULL DEFAULT (timezone('utc'::text, now()) + '2 days'::interval),

    CONSTRAINT "PasswordReset_pkey" PRIMARY KEY ("otp")
);

-- CreateTable
CREATE TABLE "Otp" (
    "id" TEXT NOT NULL,
    "code" VARCHAR(6) NOT NULL,
    "type" "OTPType" NOT NULL DEFAULT 'OTHER',
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Otp_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "phoneNumber" TEXT,
    "avatar" TEXT,
    "companyName" TEXT,
    "userType" "UserType" NOT NULL DEFAULT 'USER',
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EmailChange_userId_key" ON "EmailChange"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "PasswordReset_userId_key" ON "PasswordReset"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Otp_code_key" ON "Otp"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Otp_userId_type_key" ON "Otp"("userId", "type");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_phoneNumber_key" ON "User"("phoneNumber");

-- AddForeignKey
ALTER TABLE "EmailChange" ADD CONSTRAINT "EmailChange_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PasswordReset" ADD CONSTRAINT "PasswordReset_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Otp" ADD CONSTRAINT "Otp_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
