/* Create contribution schema */
DROP DATABASE IF EXISTS campaign_finance;
CREATE DATABASE campaign_finance;

/* Add api acccess to database */
CREATE USER 'api' IDENTIFIED BY 'api';
GRANT SELECT ON campaign_finance.* to 'api'@'localhost';
FLUSH PRIVILEGES;

/* Create main contributions table */
DROP TABLE IF EXISTS campaign_finance.contributions;
CREATE TABLE campaign_finance.contributions
(
	`id` 				bigint(20) unsigned NOT NULL AUTO_INCREMENT,
	`filerid` 			char varying(8) 	DEFAULT NULL,
	`year` 				int(11) 			DEFAULT NULL,
	`cycle` 			char varying(5) 	DEFAULT NULL,
	`section` 			char varying(2) 	DEFAULT NULL,
	`contributor` 		char varying(100) 	DEFAULT NULL,
	`address` 			char varying(150) 	DEFAULT NULL,
	`address2` 			char varying(50) 	DEFAULT NULL,
	`city` 				char varying(50) 	DEFAULT NULL,
	`state` 			char varying(3) 	DEFAULT NULL,
	`zip` 				char varying(10) 	DEFAULT NULL,
	`newzip` 			char varying(10) 	DEFAULT NULL,
	`occupation` 		char varying(100) 	DEFAULT NULL,
	`empName` 			char varying(100) 	DEFAULT NULL,
	`empAddress1` 		char varying(150) 	DEFAULT NULL,
	`empAddress2` 		char varying(50) 	DEFAULT NULL,
	`empCity` 			char varying(50) 	DEFAULT NULL,
	`empState` 			char varying(3) 	DEFAULT NULL,
	`unformattedDate` 	char varying(8) 	DEFAULT NULL,
	`date` 				date 				DEFAULT NULL,
	`contribution` 		float 				DEFAULT NULL,
	`description` 		char varying(200) 	DEFAULT NULL,
	PRIMARY KEY (`id`),
	UNIQUE KEY `id` (`id`)
);

/* Create filer table */
DROP TABLE IF EXISTS campaign_finance.filers;
CREATE TABLE campaign_finance.filers
(
	`filerid` 			char varying(10)		DEFAULT NULL,
	`type`				int					DEFAULT NULL,
	`name`				char varying(200)	DEFAULT NULL,
	`office`			char varying(100)	DEFAULT NULL,
	`district`			char varying(50)	DEFAULT NULL,
	`party`				char varying(50)	DEFAULT NULL,
	`address1`			char varying(150)	DEFAULT NULL,
	`address2`			char varying(50)	DEFAULT NULL,
	`city`				char varying(50)	DEFAULT NULL,
	`state`				char varying(3)		DEFAULT NULL,
	`zip`				char varying(10)	DEFAULT NULL,
	`county`			char varying(2)		DEFAULT NULL,
	`phone`				char varying(12)	DEFAULT NULL,
	PRIMARY KEY (`filerid`),
	UNIQUE KEY `filerid` (`filerid`)
);

/* Create filings table */
DROP TABLE IF EXISTS campaign_finance.filings;
CREATE TABLE campaign_finance.filings
(
	`id` 					bigint(20) unsigned NOT NULL AUTO_INCREMENT,
	`filerid` 			char varying(8)		DEFAULT NULL,
	`year`				int					DEFAULT NULL,
	`ammend_flag`		char(1)				DEFAULT NULL,
	`terminated_flag`	char(1)				DEFAULT NULL,
	`beginning`			float				DEFAULT NULL,
	`monetary`			float				DEFAULT NULL,
	`inkind`			float				DEFAULT NULL,
	PRIMARY KEY (`id`),
	UNIQUE KEY `id` (`id`)
);

/* CREATE candidate table */
DROP TABLE IF EXISTS campaign_finance.candidates;
CREATE TABLE campaign_finance.candidates
(
	`id` 				bigint(20) unsigned NOT NULL AUTO_INCREMENT,
	`filerid` 			char varying(8)		DEFAULT NULL,
	`year`				int					DEFAULT NULL,
	`race`				char varying(50)	DEFAULT NULL,
	`name`				char varying(50)	DEFAULT NULL,
	`party`				char varying(50)	DEFAULT NULL,	
	PRIMARY KEY (`id`),
	UNIQUE KEY `id` (`id`)
);