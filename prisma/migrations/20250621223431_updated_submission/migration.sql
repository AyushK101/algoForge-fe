/*
  Warnings:

  - Added the required column `result` to the `Submission` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Submission" ADD COLUMN     "result" BOOLEAN NOT NULL;
