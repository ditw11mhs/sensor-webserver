-- CreateTable
CREATE TABLE `Datalog` (
    `DeviceID` VARCHAR(255) NOT NULL,
    `Sensor1` DOUBLE NOT NULL,
    `Sensor2` DOUBLE NOT NULL,
    `Sensor3` DOUBLE NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`DeviceID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
