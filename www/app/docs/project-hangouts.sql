-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
DROP SCHEMA IF EXISTS `project` ;

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `project` DEFAULT CHARACTER SET utf8 ;
USE `project` ;

-- -----------------------------------------------------
-- Table `project`.`Users`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `project`.`Users` ;

CREATE TABLE IF NOT EXISTS `project`.`Users` (
  `id` CHAR(36) CHARACTER SET 'utf8' NOT NULL,
  `email` VARCHAR(255) CHARACTER SET 'utf8' NOT NULL,
  `password` CHAR(255) CHARACTER SET 'utf8' NOT NULL,
  `created_at` DATETIME NULL DEFAULT NULL,
  `deleted_at` DATETIME NULL DEFAULT NULL,
  `update_at` DATETIME NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `email_unique` (`email` ASC))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8
COLLATE = utf8_unicode_ci;


-- -----------------------------------------------------
-- Table `project`.`Cities`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `project`.`Cities` ;

CREATE TABLE IF NOT EXISTS `project`.`Cities` (
  `id` CHAR(36) CHARACTER SET 'utf8' NOT NULL,
  `name` VARCHAR(100) CHARACTER SET 'utf8' NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8
COLLATE = utf8_unicode_ci;


-- -----------------------------------------------------
-- Table `project`.`Events`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `project`.`Events` ;

CREATE TABLE IF NOT EXISTS `project`.`Events` (
  `id` CHAR(36) CHARACTER SET 'utf8' NOT NULL,
  `title` VARCHAR(255) CHARACTER SET 'utf8' NOT NULL,
  `description` TEXT CHARACTER SET 'utf8' NOT NULL,
  `user_id` CHAR(36) CHARACTER SET 'utf8' NOT NULL,
  `city_id` CHAR(36) CHARACTER SET 'utf8' NULL DEFAULT NULL,
  `photo_url` VARCHAR(255) CHARACTER SET 'utf8' NULL DEFAULT NULL,
  `address` VARCHAR(255) CHARACTER SET 'utf8' NULL DEFAULT NULL,
  `place` TINYTEXT CHARACTER SET 'utf8' NULL DEFAULT NULL,
  `event_date` DATE NOT NULL,
  `event_hour` TIME NOT NULL,
  `created_at` DATETIME NULL DEFAULT NULL,
  `max_capacity` TINYINT(4) NOT NULL,
  `deleted_at` DATETIME NULL DEFAULT NULL,
  `signed_guests` TINYINT(4) NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  INDEX `user_id` (`user_id` ASC),
  INDEX `city_id` (`city_id` ASC),
  CONSTRAINT `Events_ibfk_1`
    FOREIGN KEY (`user_id`)
    REFERENCES `project`.`Users` (`id`),
  CONSTRAINT `Events_ibfk_2`
    FOREIGN KEY (`city_id`)
    REFERENCES `project`.`Cities` (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8
COLLATE = utf8_unicode_ci;


-- -----------------------------------------------------
-- Table `project`.`Attendance`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `project`.`Attendance` ;

CREATE TABLE IF NOT EXISTS `project`.`Attendance` (
  `id_users` CHAR(36) CHARACTER SET 'utf8' NOT NULL,
  `event_id` CHAR(36) CHARACTER SET 'utf8' NOT NULL,
  `request_status` TINYINT NOT NULL DEFAULT 1,
  PRIMARY KEY (`id_users`, `event_id`),
  INDEX `event_id` (`event_id` ASC),
  CONSTRAINT `Users_Events_ibfk_1`
    FOREIGN KEY (`id_users`)
    REFERENCES `project`.`Users` (`id`),
  CONSTRAINT `Users_Events_ibfk_2`
    FOREIGN KEY (`event_id`)
    REFERENCES `project`.`Events` (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8
COLLATE = utf8_unicode_ci;


-- -----------------------------------------------------
-- Table `mydb`.`Rating`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `project`.`Rating` ;

CREATE TABLE IF NOT EXISTS `project`.`Ratings` (
  `id_rater` CHAR(36) CHARACTER SET 'utf8' NOT NULL,
  `event_id` CHAR(36) CHARACTER SET 'utf8' NOT NULL,
  `id_rated` CHAR(36) CHARACTER SET 'utf8' NOT NULL,
  `rating` TINYINT NULL DEFAULT NULL,
  INDEX `fk_Rating_Attendance_idx` (`id_rater` ASC, `event_id` ASC),
  INDEX `fk_Rating_Attendance1_idx` (`id_rated` ASC),
  PRIMARY KEY (`id_rater`, `event_id`, `id_rated`),
  CONSTRAINT `fk_Rating_Attendance`
    FOREIGN KEY (`id_rater` , `event_id`)
    REFERENCES `project`.`Attendance` (`id_users` , `event_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Rating_Attendance1`
    FOREIGN KEY (`id_rated`)
    REFERENCES `project`.`Attendance` (`id_users`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

USE `project` ;

-- -----------------------------------------------------
-- Table `project`.`Profiles`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `project`.`Profiles` ;

CREATE TABLE IF NOT EXISTS `project`.`Profiles` (
  `user_id` CHAR(36) CHARACTER SET 'utf8' NOT NULL,
  `age` TINYINT(100) NULL DEFAULT NULL,
  `name` VARCHAR(100) CHARACTER SET 'utf8' NULL DEFAULT NULL,
  `category` VARCHAR(100) CHARACTER SET 'utf8' NULL DEFAULT NULL,
  `position` VARCHAR(100) CHARACTER SET 'utf8' NULL DEFAULT NULL,
  `aboutMe` VARCHAR(500) CHARACTER SET 'utf8' NULL DEFAULT NULL,
  `avatar_url` VARCHAR(255) CHARACTER SET 'utf8' NULL DEFAULT NULL,
  `link_url` VARCHAR(255) CHARACTER SET 'utf8' NULL DEFAULT NULL,
  `created_at` DATETIME NULL DEFAULT NULL,
  `update_at` DATETIME NULL DEFAULT NULL,
  PRIMARY KEY (`user_id`),
  INDEX `user_id` (`user_id` ASC),
  CONSTRAINT `Profiles_ibfk_1`
    FOREIGN KEY (`user_id`)
    REFERENCES `project`.`Users` (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8
COLLATE = utf8_unicode_ci;

INSERT INTO Cities (id,name)  VALUES
("5a3837fa-b4da-4550-b177-9c30c505cd52", "A Coruna"),
("5c66391f-3ae0-4bc9-8309-b275f0687ca7" , "Madrid"),
("31cd9f5f-a7f2-42b9-8c6b-13a39ae7ccdf" , "Barcelona"),
("e5cdce3e-8ff2-442c-8e3e-dba89a476131" , "Sevilla");

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
