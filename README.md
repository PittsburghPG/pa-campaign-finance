Pennsylvania campaign finance tracker
========

A Post-Gazette/PublicSource collaboration cataloging campaign finance figures for the 2014 gubernatorial election (and beyond!) 

#API

##Show contributions
  Returns json listing either a collection of contributions, or a single contribution specified by an `id`. 

* **URL**

  /contributions

  /contributions/:contributor-id

* **Method:**

  `GET`

* **URL Paths**
    
    * **/contributors/:contributor-id<br />**
    Filters by specific contributor.<br />
       Example: `contributions/contributors/324`
    * **/filers/:filerid** <br />
    Filters by specific PAC or candidate.<br />
       Example: `contributions/filers/Tom Wolf for Governor`
    * **/candidates/:candidate-name** <br />
    Filters by specific candidate, using filerid.<br />
       Example: `contributions/candidates/2009216`
	* **/counties/:county** <br />
    Filters by county, using county name.<br />
       Example: `contributions/counties/allegheny`
	* **/states/:state** <br />
    Filters by state, using state abbreviation.<br />
       Example: `contributions/states/PA`   

*  **URL Params**

    * **contributorname=[string]<br />**
    Filters by contributor name (wildcarded).<br />
       Example: `contributions/?contributorname=andrew`
    * **filername=[string]<br />**
    Filters by filer name (wildcarded).<br />
       Example: `contributions/?filername=corbett`
    * **contributor_city=[string]<br />**
    Filters by contributor's listed city (wildcarded).<br />
       Example: `contributions/?contributor_city=pittsburgh`
    * **contributor_zip=[string]<br />**
    Filters by contributor's listed zip code (wildcarded).<br />
       Example: `contributions/?contributor_zip=15222`
    * **county=[string]<br />**
    Filters by contributor's listed county (wildcarded).<br />
       Example: `contributions/?county=phila`
	* **employer=[string]<br />**
    Filters by contributor's employer's name (wildcarded).<br />
       Example: `contributions/?employer=US Steel`
    * **startDate=[YYYY-MM-DD]<br />**
    Filters for contributions made after (and including) specified date.<br />
       Example: `contributions/?startDate=2014-06-01`
    * **endDate=[YYYY-MM-DD]<br />**
    Filters for contributions made before (and including) specified date.<br />
       Example: `contributions/?endDate=2014-10-01`
    * **startAmount=[integer]<br />**
    Filters for contributions over (but including) specified amount.<br />
       Example: `contributions/?startAmount=1000`
    * **endAmount=[integer]<br />**
    Filters for contributions under (but including) specified amount.<br />
       Example: `contributions/?startAmount=2500`
	* **limit=[integer]<br />**
    Sets limit of returned records.<br />
       Example: `contributions/?limit=50`
	* **offset=[integer]<br />**
    Ignores first x returned records.<br />
       Example: `contributions/?offset=2500`
	
* **Data Params**

    None

* **Success Response:**

  * **Code:** 200 <br />
    **Content:** 
    
    ```javascript
    {
        "sql": [SQL QUERY STRING],
        "results": [
            {
                "id": "1",
                "contribution": "150",
                "contributor": "FRANK C. BYHAM",
                "name": "TOM CORBETT FOR GOVERNOR",
                "date": "2013-12-19",
                "description": ""
            },
            {
                "id": "2",
                "contribution": "250",
                "contributor": "JAMES H. MCCUNE",
                "name": "TOM CORBETT FOR GOVERNOR",
                "date": "2013-05-14",
                "description": ""
            }
            ...
        ]
    }
	```
	
 
* **Error Response:**

  * **Code:** 404 NOT FOUND <br />
    **Content:** `{ error : "User doesn't exist" }`

  OR

  * **Code:** 401 UNAUTHORIZED <br />
    **Content:** `{ error : "You are unauthorized to make this request." }`

* **Sample Call:**

  ```javascript
    $.ajax({
      url: "/contributions/10",
      dataType: "json",
      type : "GET",
      success : function(r) {
        console.log(r);
      }
    });
  ```
  
  ##Show contributors
  Returns json listing either a collection of contributors, or a single contributor specified by an `name`. 

* **URL**

  /contributors

  /contributors/:name

* **Method:**

  `GET`

* **URL Paths**
    
    * **/filers/:filerid** <br />
    Filters to contributors who have given to a specific PAC or candidate.<br />
       Example: `contributors/filers/2001167`
    * **/candidates/:candidate-name** <br />
    Filters to contributors who have given to a specific candidate, using their filerid.<br />
       Example: `contributors/candidates/Tom Wolf`

*  **URL Params**

       Example: `contributions/?contributor=andrew`
    * **filername=[string]<br />**
    Filters by filer name (wildcarded).<br />
       Example: `contributions/?filername=corbett`
    * **contributor_city=[string]<br />**
    Filters by contributor's listed city (wildcarded).<br />
       Example: `contributors/?contributor_city=pittsburgh`
    * **contributor_zip=[string]<br />**
    Filters by contributor's listed zip code (wildcarded).<br />
       Example: `contributors/?contributor_zip=15222`
    * **employer=[string]<br />**
    Filters by contributor's employer's name (wildcarded).<br />
       Example: `contributors/?employer=US Steel`
    * **startDate=[YYYY-MM-DD]<br />**
    Filters for contributions made after (and including) specified date.<br />
       Example: `contributors/?startDate=2014-06-01`
    * **endDate=[YYYY-MM-DD]<br />**
    Filters for contributions made before (and including) specified date.<br />
       Example: `contributors/?endDate=2014-10-01`
    * **startAmount=[integer]<br />**
    Filters for contributions over (but including) specified amount.<br />
       Example: `contributors/?startAmount=1000`
    * **endAmount=[integer]<br />**
    Filters for contributions under (but including) specified amount.<br />
       Example: `contributors/?startAmount=2500`

* **Data Params**

    None

* **Success Response:**

  * **Code:** 200 <br />
    **Content:** 
    
    ```javascript
    {
        "sql": [SQL QUERY STRING],
        "results": [
            {
                "contributor": "3090 ROUTE 73 NORTH, LLC",
                "address": "34 SANDRINGHAM RD",
                "address2": "",
                "city": "BALA CYNWYD",
                "state": "PA",
                "occupation": "19004",
                "empName": "",
                "empAddress1": "",
                "empAddress2": "",
                "empCity": "",
                "empState": "",
                "empZip": "",
                "contributions": "2",
                "total_contribution": "1000",
                "beneficiaries": [
                    {
                        "name": "TOM CORBETT FOR GOVERNOR",
                        "contribution": "1000"
                    }
                ]
            },
            {
                "contributor": "357 NORTH CRAIG ST. ASSOCIATES",
                "address": "357 N. CRAIG ST",
                "address2": "",
                "city": "PITTSBURGH",
                "state": "PA",
                "occupation": "15213",
                "empName": "",
                "empAddress1": "",
                "empAddress2": "",
                "empCity": "",
                "empState": "",
                "empZip": "",
                "contributions": "1",
                "total_contribution": "500",
                "beneficiaries": [
                    {
                        "name": "TOM CORBETT FOR GOVERNOR",
                        "contribution": "500"
                    }
                ]
            }
			...
        ]
    }
	```
	
 
* **Error Response:**

  * **Code:** 404 NOT FOUND <br />
    **Content:** `{ error : "User doesn't exist" }`

  OR

  * **Code:** 401 UNAUTHORIZED <br />
    **Content:** `{ error : "You are unauthorized to make this request." }`

* **Sample Call:**

  ```javascript
    $.ajax({
      url: "/contributors/AIR PRODUCTS PA POLITICAL ALLIANCE",
      dataType: "json",
      type : "GET",
      success : function(r) {
        console.log(r);
      }
    });
  ```
  
  ##Show candidates
  Returns json listing either a collection of candidates, or a single candidate specified by a `filerid`. 

* **URL**

  /candidates

  /candidates/:filerid

* **Method:**

  `GET`

* **URL Paths**

	* **/contributors/:contributor-name<br />**
    Filters to candidates who have received donations from a specific contributor.<br />
       Example: `candidates/contributors/andrew mcgill`

*  **URL Params**
	
	* **contributor=[string]<br />**
    Filters to candidates who have received donation from contributor by contributor name (wildcarded).<br />
       Example: `candidates/?contributor=andrew`
    * **filername=[string]<br />**
    Filters by filer name (wildcarded).<br />
       Example: `candidates/?filername=corbett`
    * **contributor_city=[string]<br />**
    Filters by contributor's listed city (wildcarded).<br />
       Example: `candidates/?contributor_city=pittsburgh`
    * **contributor_zip=[string]<br />**
    Filters by contributor's listed zip code (wildcarded).<br />
       Example: `candidates/?contributor_zip=15222`
    * **employer=[string]<br />**
    Filters by contributor's employer's name (wildcarded).<br />
       Example: `candidates/?employer=US Steel`
    * **startDate=[YYYY-MM-DD]<br />**
    Filters by candidate who received contributions made after (and including) specified date.<br />
       Example: `candidates/?startDate=2014-06-01`
    * **endDate=[YYYY-MM-DD]<br />**
    Filters by candidate who received contributions made before (and including) specified date.<br />
       Example: `candidates/?endDate=2014-10-01`
    * **startAmount=[integer]<br />**
    Filters for candidates who received contributions over (and including) specified amount.<br />
       Example: `candidates/?startAmount=1000`
    * **endAmount=[integer]<br />**
    Filters for contributions under (and including) specified amount.<br />
       Example: `candidates/?startAmount=2500`

* **Data Params**

    None

* **Success Response:**

  * **Code:** 200 <br />
    **Content:** 
    
    ```javascript
    {
        "sql": [QUERY SQL HERE],
        "results": [
            {
                "name": "Tom Corbett",
                "filerid": "2009216",
                "party": "REP",
                "year": "2014",
                "race": "GOV",
                "total": "12192524.399908066",
                "count": "8944"
            },
            {
                "name": "Tom Wolf",
                "filerid": "20130153",
                "party": "DEM",
                "year": "2014",
                "race": "GOV",
                "total": null,
                "count": "0"
            }
        ]
    }
	```
	
 
* **Error Response:**

  * **Code:** 404 NOT FOUND <br />
    **Content:** `{ error : "User doesn't exist" }`

  OR

  * **Code:** 401 UNAUTHORIZED <br />
    **Content:** `{ error : "You are unauthorized to make this request." }`

* **Sample Call:**

  ```javascript
    $.ajax({
      url: "/candidates/2009216",
      dataType: "json",
      type : "GET",
      success : function(r) {
        console.log(r);
      }
    });
  ```
  
##Show filers
  Returns json listing either a collection of PACS and candidate committees who have filed finance reports, or a single filer specified by a `filerid`. 

* **URL**

  /filers

  /filers/:filerid

* **Method:**

  `GET`

* **URL Paths**

	* **/contributors/:contributor-name<br />**
    Filters to filers who have received donations from a specific contributor.<br />
       Example: `filers/contributors/andrew mcgill`

*  **URL Params**
	
	* **contributor=[string]<br />**
    Filters to filers who have received donation from contributor by contributor name (wildcarded).<br />
       Example: `filers/?contributor=andrew`
    * **filername=[string]<br />**
    Filters by filer name (wildcarded).<br />
       Example: `filers/?filername=corbett`
    * **contributor_city=[string]<br />**
    Filters by contributor's listed city (wildcarded).<br />
       Example: `filers/?contributor_city=pittsburgh`
    * **contributor_zip=[string]<br />**
    Filters by contributor's listed zip code (wildcarded).<br />
       Example: `filers/?contributor_zip=15222`
    * **employer=[string]<br />**
    Filters by contributor's employer's name (wildcarded).<br />
       Example: `filers/?employer=US Steel`
    * **startDate=[YYYY-MM-DD]<br />**
    Filters by filers who received contributions made after (and including) specified date.<br />
       Example: `filers/?startDate=2014-06-01`
    * **endDate=[YYYY-MM-DD]<br />**
    Filters by filers who received contributions made before (and including) specified date.<br />
       Example: `filers/?endDate=2014-10-01`
    * **startAmount=[integer]<br />**
    Filters for filers who received contributions over (and including) specified amount.<br />
       Example: `filers/?startAmount=1000`
    * **endAmount=[integer]<br />**
    Filters for filers who received contributions under (and including) specified amount.<br />
       Example: `filers/?startAmount=2500`

* **Data Params**

    None

* **Success Response:**

  * **Code:** 200 <br />
    **Content:** 
    
    ```javascript
    {
        "sql": [QUERY SQL],
        "results": [
            {
                "name": "FirstEnergy Corp. Political Action Committee",
                "filerid": "2000081",
                "type": "2",
                "office": "",
                "district": "",
                "party": "",
                "address1": "76 South Main Street",
                "address2": "",
                "city": "Akron",
                "state": "OH",
                "zip": "44308",
                "county": "",
                "phone": "0"
            },
            {
                "name": "RE-ELECT ANGEL CRUZFOR THE 180TH",
                "filerid": "2000085",
                "type": "2",
                "office": "STH",
                "district": "180",
                "party": "DEM",
                "address1": "133 E WESTMORELAND ST",
                "address2": "",
                "city": "PHILADELPHIA",
                "state": "PA",
                "zip": "19134",
                "county": "51",
                "phone": "2154235610"
            },
            {
                "name": "Friends of Senator Don White",
                "filerid": "2000115",
                "type": "2",
                "office": "",
                "district": "",
                "party": "",
                "address1": "368 School Street",
                "address2": "",
                "city": "Indiana",
                "state": "PA",
                "zip": "15701",
                "county": "",
                "phone": "7244655001"
            }
        ]
    }
	```
	
 
* **Error Response:**

  * **Code:** 404 NOT FOUND <br />
    **Content:** `{ error : "User doesn't exist" }`

  OR

  * **Code:** 401 UNAUTHORIZED <br />
    **Content:** `{ error : "You are unauthorized to make this request." }`

* **Sample Call:**

  ```javascript
    $.ajax({
      url: "/candidates/2009216",
      dataType: "json",
      type : "GET",
      success : function(r) {
        console.log(r);
      }
    });
  ```