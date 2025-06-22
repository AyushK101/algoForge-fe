/*
  Warnings:

  - You are about to drop the column `compiler_output` on the `Submission` table. All the data in the column will be lost.
  - You are about to drop the column `result` on the `Submission` table. All the data in the column will be lost.
  - Added the required column `compile_output` to the `Submission` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `Submission` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Submission" DROP COLUMN "compiler_output",
DROP COLUMN "result",
ADD COLUMN     "compile_output" TEXT NOT NULL,
ADD COLUMN     "status" TEXT NOT NULL;
