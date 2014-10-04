DELIMITER ;;
DROP PROCEDURE IF EXISTS add_contributorid ;;
CREATE PROCEDURE add_contributorid()
BEGIN
	IF NOT EXISTS (
		SELECT * 
		FROM 	information_schema.columns 
		WHERE 	table_schema=DATABASE() 
				AND table_name='contributions' 
				AND column_name='contributorid') 
	THEN
		ALTER TABLE campaign_finance.contributions
		ADD 	contributorid bigint(20)	 unsigned 	not null;
	end if;
	
	DROP TABLE IF EXISTS campaign_finance.contributors;
	CREATE TABLE campaign_finance.contributors
		(SELECT 	contributor, 
					address, 
					address2,
					city, 
					state, 
					zip 
	
		FROM 		campaign_finance.contributions 
		GROUP BY contributor, 
					address, 
					address2,
					city, 
					state, 
					zip);

	ALTER TABLE campaign_finance.contributors
	ADD 	`contributorid`		bigint(20) unsigned NOT NULL AUTO_INCREMENT PRIMARY KEY;

	UPDATE 		campaign_finance.contributions
	JOIN 		campaign_finance.contributors 
	ON 			contributions.contributor = contributors.contributor
	AND 		contributions.address = contributors.address
	AND 		contributions.address2 = contributors.address2
	AND 		contributions.city = contributors.city
	AND 		contributions.state = contributors.state
	AND 		contributions.zip = contributors.zip
	SET 		contributions.contributorid = contributors.contributorid;
	
END ;;

CALL add_contributorid() ;;

DROP PROCEDURE IF EXISTS add_contributorid ;;

DELIMITER ;