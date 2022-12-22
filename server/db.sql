ALTER TABLE `clubsaas`.`role_auth` ADD COLUMN `menu_id` INT NULL DEFAULT 0 AFTER `update_time`;

CREATE TABLE `clubsaas`.`menu_table` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `mid` INT NOT NULL DEFAULT 0,
  `type` INT NULL DEFAULT 0,
  `name` VARCHAR(45) NULL,
  `description` VARCHAR(256) NULL,
  `url` VARCHAR(128) NULL,
  `method` varchar(4) NOT NULL DEFAULT '0000',
  `parent_id` int not null default 0,
  `position` int not null default 0,
  `status` INT NULL DEFAULT 1,
  `create_time` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `update_time` VARCHAR(45) NULL,
  PRIMARY KEY (`id`));


CREATE TABLE `clubsaas`.`balance_type` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `mid` INT NOT  NULL DEFAULT 0,
  `type` VARCHAR(45) NULL,
  `status` INT NULL DEFAULT 1,
  `level` INT NULL DEFAULT 0,
  `create_time` TIMESTAMP NULL DEFAULT current_timestamp,
  `update_time` DATETIME NULL,
  PRIMARY KEY (`id`));


CREATE TABLE `clubsaas`.`user_action` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `mid` INT NULL DEFAULT 0,
  `user_type` INT NULL DEFAULT 0,
  `user_id` INT NULL DEFAULT 0,
  `action` VARCHAR(45) NULL,
  `url` VARCHAR(128) NULL,
  `content` TEXT NULL,
  `status` INT NULL DEFAULT 1,
  `create_time` TIMESTAMP NULL DEFAULT current_timestamp,
  `update_time` DATETIME NULL,
  PRIMARY KEY (`id`));


ALTER TABLE `clubsaas`.`muser` 
ADD COLUMN `is_coach` INT NULL DEFAULT 0 AFTER `update_time`,
ADD COLUMN `is_assistant` INT NULL DEFAULT 0 AFTER `is_coach`;


ALTER TABLE `clubsaas`.`user_balance` 
ADD COLUMN `balance_typeid` INT NULL DEFAULT 0 AFTER `update_time`;

ALTER TABLE `clubsaas`.`user_balance_snapshot` 
ADD COLUMN `balance_typeid` INT NULL DEFAULT 0 AFTER `snap_date`;

ALTER TABLE `clubsaas`.`user_balance_record` 
ADD COLUMN `balance_typeid` INT NULL DEFAULT 0 AFTER `update_time`;

ALTER TABLE `clubsaas`.`user_order` 
CHANGE COLUMN `peoples` `peoples` INT NULL DEFAULT 1 ;

ALTER TABLE `clubsaas`.`user_order` 
ADD COLUMN `balance_typeid` INT NULL DEFAULT 0 AFTER `peoples`;

alter table  `clubsaas`.`muser`
add column `area_id` int null default 0 after is_assistant;

CREATE TABLE `clubsaas`.`area` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NULL,
  `description` VARCHAR(256) NULL,
  `status` INT NULL DEFAULT 0,
  `mid` INT NULL DEFAULT 0,
  `create_time` TIMESTAMP NULL DEFAULT current_timestamp,
  `update_time` VARCHAR(45) NULL,
  PRIMARY KEY (`id`));

ALTER TABLE `clubsaas`.`group` 
add COLUMN `area_id` INT NULL DEFAULT 0 after mid;

ALTER TABLE `clubsaas`.`user` 
ADD COLUMN `area_id` INT NULL DEFAULT 0 AFTER `update_time`;
ALTER TABLE `clubsaas`.`member` 
ADD COLUMN `area_id` INT NULL DEFAULT 0 AFTER `level`;

ALTER TABLE `clubsaas`.`coach` 
ADD COLUMN `area_id` INT NULL DEFAULT 0 AFTER `expired_time`;

ALTER TABLE `clubsaas`.`event` 
ADD COLUMN `area_id` INT NULL DEFAULT 0 AFTER `publish_status`;

ALTER TABLE `clubsaas`.`product` 
ADD COLUMN `area_id` INT NULL DEFAULT 0 AFTER `minutes`;



CREATE TABLE `clubsaas`.`course` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NULL,
  `description` TEXT NULL,
  `status` INT NULL DEFAULT 0,
  `mid` INT NULL DEFAULT 0,
  `lessonhours` int null default 0,
  `create_time` TIMESTAMP NULL DEFAULT current_timestamp,
  `update_time` VARCHAR(45) NULL,
  PRIMARY KEY (`id`));

CREATE TABLE `clubsaas`.`lesson` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `course_id` int not null default 0,
  `name` VARCHAR(45) NULL,
  `description` TEXT NULL,  
  `status` INT NULL DEFAULT 0,
  `mid` INT NULL DEFAULT 0,
  `lessonNo` int null default 0,
  `create_time` TIMESTAMP NULL DEFAULT current_timestamp,
  `update_time` VARCHAR(45) NULL,
  PRIMARY KEY (`id`));

CREATE TABLE `clubsaas`.`lesson_page` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `lesson_id` int not null default 0,
  `title` varchar(64) not null,
  `content` text NULL,
  `pageNo` int null default 0,
  `status` INT NULL DEFAULT 0,
  `mid` INT NULL DEFAULT 0,  
  `create_time` TIMESTAMP NULL DEFAULT current_timestamp,
  `update_time` VARCHAR(45) NULL,
  PRIMARY KEY (`id`));