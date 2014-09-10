 /* Create contribution schema */
DROP DATABASE IF EXISTS campaign_finance;
CREATE DATABASE campaign_finance;

/* Create main contributions table */
DROP TABLE IF EXISTS campaign_finance.contributions;
CREATE TABLE campaign_finance.contributions
(
	id 				serial NOT NULL,
	filerid 		char varying(8),
	year 			int,
	cycle 			char(1),
	section 		char(2),
	contributor 	char(100),
	address 		char(150),
	address2 		char(50),
	
	
)