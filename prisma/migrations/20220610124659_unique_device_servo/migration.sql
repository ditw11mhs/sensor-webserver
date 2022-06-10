/*
  Warnings:

  - The primary key for the `Servo` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE `Servo` DROP PRIMARY KEY,
    ADD PRIMARY KEY (`DeviceID`);
