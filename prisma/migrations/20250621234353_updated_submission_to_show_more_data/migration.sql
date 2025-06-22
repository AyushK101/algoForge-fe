/*
  Warnings:

  - Added the required column `compiler_output` to the `Submission` table without a default value. This is not possible if the table is not empty.
  - Added the required column `memory` to the `Submission` table without a default value. This is not possible if the table is not empty.
  - Added the required column `message` to the `Submission` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stdout` to the `Submission` table without a default value. This is not possible if the table is not empty.
  - Added the required column `time` to the `Submission` table without a default value. This is not possible if the table is not empty.
  - Added the required column `token` to the `Submission` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Submission" ADD COLUMN     "compiler_output" TEXT NOT NULL,
ADD COLUMN     "memory" INTEGER NOT NULL,
ADD COLUMN     "message" TEXT NOT NULL,
ADD COLUMN     "stdout" TEXT NOT NULL,
ADD COLUMN     "time" TEXT NOT NULL,
ADD COLUMN     "token" TEXT NOT NULL;
