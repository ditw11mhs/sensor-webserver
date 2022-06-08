-- CreateTable
CREATE TABLE `Datastream` (
    `deviceID` VARCHAR(255) NOT NULL,
    `sensor1` DOUBLE NOT NULL,

    PRIMARY KEY (`deviceID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
