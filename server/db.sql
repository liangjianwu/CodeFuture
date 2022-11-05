ALTER TABLE `clubsaas`.`role_auth` ADD COLUMN `func_id` INT NULL DEFAULT 0 AFTER `update_time`;

CREATE TABLE `clubsaas`.`menu_table` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `type` INT NULL DEFAULT 0,
  `name` VARCHAR(45) NULL,
  `description` VARCHAR(256) NULL,
  `url` VARCHAR(128) NULL,
  `create_time` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `update_time` VARCHAR(45) NULL,
  PRIMARY KEY (`id`));


CREATE TABLE `clubsaas`.`balance_type` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `mid` INT NOT  NULL DEFAULT 0,
  `type` VARCHAR(45) NULL,
  `status` INT NULL DEFAULT 1,
  `create_time` TIMESTAMP NULL DEFAULT current_timestamp,
  `update_time` DATETIME NULL,
  PRIMARY KEY (`id`));


CREATE TABLE `clubsaas`.`user_action` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `mid` INT NULL DEFAULT 0,
  `type` INT NULL DEFAULT 0,
  `user_id` INT NULL DEFAULT 0,
  `action` VARCHAR(45) NULL,
  `url` VARCHAR(128) NULL,
  `content` TEXT NULL,
  `create_time` TIMESTAMP NULL DEFAULT current_timestamp,
  `update_time` DATETIME NULL,
  PRIMARY KEY (`id`));
