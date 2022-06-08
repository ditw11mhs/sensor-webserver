/*
  Warnings:

  - The primary key for the `Datastream` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `deviceID` on the `Datastream` table. All the data in the column will be lost.
  - You are about to drop the column `sensor1` on the `Datastream` table. All the data in the column will be lost.
  - Added the required column `DeviceID` to the `Datastream` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Sensor1` to the `Datastream` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Sensor2` to the `Datastream` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Sensor3` to the `Datastream` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Datastream` DROP PRIMARY KEY,
    DROP COLUMN `deviceID`,
    DROP COLUMN `sensor1`,
    ADD COLUMN `DeviceID` VARCHAR(255) NOT NULL,
    ADD COLUMN `Sensor1` DOUBLE NOT NULL,
    ADD COLUMN `Sensor2` DOUBLE NOT NULL,
    ADD COLUMN `Sensor3` DOUBLE NOT NULL,
    ADD PRIMARY KEY (`DeviceID`);
