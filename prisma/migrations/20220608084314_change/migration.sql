/*
  Warnings:

  - The primary key for the `Datalog` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE `Datalog` DROP PRIMARY KEY,
    ADD PRIMARY KEY (`createdAt`);
