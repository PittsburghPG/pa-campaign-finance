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
       Example: `contributions/filers/2009216`
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
       Example: `contributions/?endAmount=2500`
	* **limit=[integer]<br />**
    Sets limit of returned records.<br />
       Example: `contributions/?limit=50`
	* **offset=[integer]<br />**
    Skips ahead first x returned records.<br />
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
                 "id": "5147",
                 "contribution": "75000",
                 "contributor": "Ross, Feller, Casey, LLP",
                 "contributorid": "10118",
                 "county": "Philadelphia County",
                 "name": "Tom Wolf for Governor",
                 "filerid": "20130153",
                 "date": "2014-09-15",
                 "description": ""
             },
             {
                 "id": "1883",
                 "contribution": "150",
                 "contributor": "Allan C. Seigle",
                 "contributorid": "231",
                 "county": "Allegheny County",
                 "name": "Tom Corbett for Governor",
                 "filerid": "2009216",
                 "date": "2014-09-15",
                 "description": ""
             },
            ...
        ]
    }
	```

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

  /contributors/:contributor-id

* **Method:**

  `GET`

* **URL Paths**
    
    * **/filers/:filerid** <br />
    Filters to contributors who have given to a specific PAC or candidate.<br />
       Example: `contributors/filers/2001167`
    * **/candidates/:candidate-id** <br />
    Filters to contributors who have given to a specific candidate, using their filerid.<br />
       Example: `contributors/candidates/20130153`

*  **URL Params**
    * **contributorname=[string]<br />**
    Filters by contributor name (wildcarded).<br />
       Example: `contributions/?contributor=andrew`
    * **candidatename=[string]<br />**
    Filters by candidate name (wildcarded).<br />
       Example: `contributions/?candidatename=corbett`
	* **filername=[string]<br />**
    Filters by filer name (wildcarded).<br />
       Example: `contributions/?filername=PPG`
    * **contributor_city=[string]<br />**
    Filters by contributor's listed city (wildcarded).<br />
       Example: `contributors/?contributor_city=pittsburgh`
    * **contributor_zip=[string]<br />**
    Filters by contributor's listed zip code (wildcarded).<br />
       Example: `contributors/?contributor_zip=15222`
    * **county=[string]<br />**
    Filters by county name (wildcarded).<br />
       Example: `contributions/?county=allegheny`
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
       Example: `contributors/?endAmount=2500`
	* **limit=[integer]<br />**
    Sets limit of returned records.<br />
       Example: `contributors/?limit=50`
	* **offset=[integer]<br />**
    Skips ahead x returned records.<br />
       Example: `contributors/?offset=2500`

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
                 "contributor": "Thomas W. Wolf",
                 "contributorid": "11333",
                 "address": "Po Box 504",
                 "address2": "",
                 "city": "Mount Wolf",
                 "state": "PA",
                 "zip": "17347",
                 "county": "York County",
                 "occupation": "Candidate",
                 "empName": "Candidate",
                 "empAddress1": "Ste 200",
                 "empCity": "York",
                 "empState": "PA",
                 "empZip": "17401",
                 "contributions": "3",
                 "amount": "9981192",
                 "beneficiaries": [
                     {
                         "name": "Tom Wolf for Governor",
                         "filerid": "20130153",
                         "contributions": "3",
                         "amount": "9981192"
                     }
                 ]
             },
             {
                 "contributor": "Republican Governors Association PAC",
                 "contributorid": "9153",
                 "address": "1747 Pennsylvania Ave., Nw",
                 "address2": "SUITE 250",
                 "city": "Washington",
                 "state": "DC",
                 "zip": "20006",
                 "county": "District of Columbia",
                 "occupation": "",
                 "empName": "",
                 "empAddress1": "",
                 "empCity": "",
                 "empState": "",
                 "empZip": "",
                 "contributions": "5",
                 "amount": "5820028",
                 "beneficiaries": [
                     {
                         "name": "Tom Corbett for Governor",
                         "filerid": "2009216",
                         "contributions": "5",
                         "amount": "5820028"
                     }
                 ]
             }
			 ...
        ]
    }
	```

* **Sample Call:**

  ```javascript
    $.ajax({
      url: "/contributors/543",
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

	* **/contributors/:contributor-id<br />**
    Filters to candidates who have received donations from a specific contributor.<br />
       Example: `candidates/contributors/312`

*  **URL Params**
    * **contributorname=[string]<br />**
    Filters by contributor name (wildcarded).<br />
       Example: `candidates/?contributor=andrew`
    * **candidatename=[string]<br />**
    Filters by candidate name (wildcarded).<br />
       Example: `candidates/?candidatename=corbett`
	* **filername=[string]<br />**
    Filters by filer name (wildcarded).<br />
       Example: `candidates/?filername=PPG`
    * **contributor_city=[string]<br />**
    Filters by contributor's listed city (wildcarded).<br />
       Example: `candidates/?contributor_city=pittsburgh`
    * **contributor_zip=[string]<br />**
    Filters by contributor's listed zip code (wildcarded).<br />
       Example: `candidates/?contributor_zip=15222`
    * **county=[string]<br />**
    Filters by county name (wildcarded).<br />
       Example: `candidates/?county=allegheny`
	* **employer=[string]<br />**
    Filters by contributor's employer's name (wildcarded).<br />
       Example: `candidates/?employer=US Steel`
    * **startDate=[YYYY-MM-DD]<br />**
    Filters for contributions made after (and including) specified date.<br />
       Example: `candidates/?startDate=2014-06-01`
    * **endDate=[YYYY-MM-DD]<br />**
    Filters for contributions made before (and including) specified date.<br />
       Example: `candidates/?endDate=2014-10-01`
    * **startAmount=[integer]<br />**
    Filters for contributions over (but including) specified amount.<br />
       Example: `candidates/?startAmount=1000`
    * **endAmount=[integer]<br />**
    Filters for contributions under (but including) specified amount.<br />
       Example: `candidates/?endAmount=2500`
	* **limit=[integer]<br />**
    Sets limit of returned records.<br />
       Example: `candidates/?limit=50`
	* **offset=[integer]<br />**
    Skips ahead x returned records.<br />
       Example: `candidates/?offset=2500`
	   
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
                 "bio": "Thomas W. Corbett, 65, is Pennsylvania's 46th governor. He previously won election twice as the state's attorney general.",
                 "address1": "P O BOX 1145",
                 "address2": "",
                 "city": "HARRISBURG",
                 "state": "PA",
                 "zip": "17108",
                 "phone": "6105651120",
                 "total": "20597469.666139603",
                 "average": "1575.8143727442125",
                 "count": "13071"
             },
             {
                 "name": "Tom Wolf",
                 "filerid": "20130153",
                 "party": "DEM",
                 "year": "2014",
                 "race": "GOV",
                 "bio": "Thomas W. Wolf, 65, is a York businessman who previously headed the Pennsylvania Department of Revenue.",
                 "address1": "102 North George St",
                 "address2": "",
                 "city": "York",
                 "state": "PA",
                 "zip": "17401",
                 "phone": "7176501912",
                 "total": "27615307.876151085",
                 "average": "3715.2304421029307",
                 "count": "7433"
             }
         ]
     }
	```

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

	* **/contributors/:contributor-id<br />**
    Filters to filers who have received donations from a specific contributor.<br />
       Example: `filers/contributors/andrew mcgill`

*  **URL Params**
    * **contributorname=[string]<br />**
    Filters by contributor name (wildcarded).<br />
       Example: `filers/?contributor=andrew`
    * **candidatename=[string]<br />**
    Filters by candidate name (wildcarded).<br />
       Example: `filers/?candidatename=corbett`
	* **filername=[string]<br />**
    Filters by filer name (wildcarded).<br />
       Example: `filers/?filername=PPG`
    * **contributor_city=[string]<br />**
    Filters by contributor's listed city (wildcarded).<br />
       Example: `filers/?contributor_city=pittsburgh`
    * **contributor_zip=[string]<br />**
    Filters by contributor's listed zip code (wildcarded).<br />
       Example: `filers/?contributor_zip=15222`
    * **county=[string]<br />**
    Filters by county name (wildcarded).<br />
       Example: `filers/?county=allegheny`
	* **employer=[string]<br />**
    Filters by contributor's employer's name (wildcarded).<br />
       Example: `filers/?employer=US Steel`
    * **startDate=[YYYY-MM-DD]<br />**
    Filters for contributions made after (and including) specified date.<br />
       Example: `filers/?startDate=2014-06-01`
    * **endDate=[YYYY-MM-DD]<br />**
    Filters for contributions made before (and including) specified date.<br />
       Example: `filers/?endDate=2014-10-01`
    * **startAmount=[integer]<br />**
    Filters for contributions over (but including) specified amount.<br />
       Example: `filers/?startAmount=1000`
    * **endAmount=[integer]<br />**
    Filters for contributions under (but including) specified amount.<br />
       Example: `filers/?endAmount=2500`
	* **limit=[integer]<br />**
    Sets limit of returned records.<br />
       Example: `filers/?limit=50`
	* **offset=[integer]<br />**
    Skips ahead x returned records.<br />
       Example: `filers/?offset=2500`

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
			 ...
         ]
     }
	```

* **Sample Call:**

  ```javascript
    $.ajax({
      url: "/filers/2009216",
      dataType: "json",
      type : "GET",
      success : function(r) {
        console.log(r);
      }
    });
  ```
  
  ##Show counties
  Returns json listing either a collection of counties home to donors, or a single county specified by a name. 

* **URL**

  /counties

  /counties/:county-name

* **Method:**

  `GET`

* **URL Paths**

	* **/counties/:contributor-id<br />**
    Filters to filers who have received donations from a specific contributor.<br />
       Example: `counties/contributors/324`
    * **/filers/:filerid** <br />
    Filters by specific PAC or candidate.<br />
       Example: `counties/filers/2009216`
    * **/candidates/:candidate-name** <br />
    Filters by specific candidate, using filerid.<br />
       Example: `contributions/candidates/2009216`
	* **/states/:state** <br />
    Filters by state, using state abbreviation.<br />
       Example: `counties/states/PA`   

*  **URL Params**
    * **contributorname=[string]<br />**
    Filters by contributor name (wildcarded).<br />
       Example: `counties/?contributor=andrew`
    * **candidatename=[string]<br />**
    Filters by candidate name (wildcarded).<br />
       Example: `counties/?candidatename=corbett`
	* **filername=[string]<br />**
    Filters by filer name (wildcarded).<br />
       Example: `counties/?filername=PPG`
    * **contributor_city=[string]<br />**
    Filters by contributor's listed city (wildcarded).<br />
       Example: `counties/?contributor_city=pittsburgh`
    * **contributor_zip=[string]<br />**
    Filters by contributor's listed zip code (wildcarded).<br />
       Example: `counties/?contributor_zip=15222`
    * **county=[string]<br />**
    Filters by county name (wildcarded).<br />
       Example: `counties/?county=allegheny`
	* **employer=[string]<br />**
    Filters by contributor's employer's name (wildcarded).<br />
       Example: `counties/?employer=US Steel`
    * **startDate=[YYYY-MM-DD]<br />**
    Filters for contributions made after (and including) specified date.<br />
       Example: `counties/?startDate=2014-06-01`
    * **endDate=[YYYY-MM-DD]<br />**
    Filters for contributions made before (and including) specified date.<br />
       Example: `counties/?endDate=2014-10-01`
    * **startAmount=[integer]<br />**
    Filters for contributions over (but including) specified amount.<br />
       Example: `counties/?startAmount=1000`
    * **endAmount=[integer]<br />**
    Filters for contributions under (but including) specified amount.<br />
       Example: `counties/?endAmount=2500`
	* **limit=[integer]<br />**
    Sets limit of returned records.<br />
       Example: `counties/?limit=50`
	* **offset=[integer]<br />**
    Skips ahead x returned records.<br />
       Example: `counties/?offset=2500`

* **Success Response:**

  * **Code:** 200 <br />
    **Content:** 
    
    ```javascript
    {
        "sql": [QUERY SQL],
        "results": [
             {
                 "county": "Adams County",
                 "state": "PA",
                 "contributions": 145,
                 "amount": 39917.320000172,
                 "beneficiaries": [
                     {
                         "name": "Tom Corbett for Governor",
                         "filerid": "2009216",
                         "party": "REP",
                         "contributions": "84",
                         "amount": "13136"
                     },
                     {
                         "name": "Tom Wolf for Governor",
                         "filerid": "20130153",
                         "party": "DEM",
                         "contributions": "61",
                         "amount": "26781.32000017166"
                     }
                 ]
             },
             {
                 "county": "Adams County",
                 "state": "WI",
                 "contributions": "2",
                 "amount": "1250",
                 "beneficiaries": [
                     {
                         "name": "Tom Corbett for Governor",
                         "filerid": "2009216",
                         "party": "REP",
                         "contributions": "2",
                         "amount": "1250"
                     }
                 ]
             }
         ]
     }
	```

* **Sample Call:**

  ```javascript
    $.ajax({
      url: "/counties/allegheny county",
      dataType: "json",
      type : "GET",
      success : function(r) {
        console.log(r);
      }
    });
  ```
  
  ##Show months
  Returns json listing a collection of months (0-11) and the amount raised in each, or a single month marked by an integer. 

* **URL**

  /months

  /months/:month-number

* **Method:**

  `GET`

* **URL Paths**

	* **/months/:contributor-id<br />**
    Filters to filers who have received donations from a specific contributor.<br />
       Example: `months/contributors/324`
    * **/filers/:filerid** <br />
    Filters by specific PAC or candidate.<br />
       Example: `months/filers/2009216`
    * **/candidates/:candidate-name** <br />
    Filters by specific candidate, using filerid.<br />
       Example: `months/candidates/2009216`
	* **/counties/:countiy** <br />
    Filters by county, using county name.<br />
       Example: `months/counties/allegheny county`   
	* **/states/:state** <br />
    Filters by state, using state abbreviation.<br />
       Example: `months/states/PA`   

*  **URL Params**
    * **contributorname=[string]<br />**
    Filters by contributor name (wildcarded).<br />
       Example: `months/?contributor=andrew`
    * **candidatename=[string]<br />**
    Filters by candidate name (wildcarded).<br />
       Example: `months/?candidatename=corbett`
	* **filername=[string]<br />**
    Filters by filer name (wildcarded).<br />
       Example: `months/?filername=PPG`
    * **contributor_city=[string]<br />**
    Filters by contributor's listed city (wildcarded).<br />
       Example: `months/?contributor_city=pittsburgh`
    * **contributor_zip=[string]<br />**
    Filters by contributor's listed zip code (wildcarded).<br />
       Example: `months/?contributor_zip=15222`
    * **county=[string]<br />**
    Filters by county name (wildcarded).<br />
       Example: `months/?county=allegheny`
	* **employer=[string]<br />**
    Filters by contributor's employer's name (wildcarded).<br />
       Example: `months/?employer=US Steel`
    * **startDate=[YYYY-MM-DD]<br />**
    Filters for contributions made after (and including) specified date.<br />
       Example: `months/?startDate=2014-06-01`
    * **endDate=[YYYY-MM-DD]<br />**
    Filters for contributions made before (and including) specified date.<br />
       Example: `months/?endDate=2014-10-01`
    * **startAmount=[integer]<br />**
    Filters for contributions over (but including) specified amount.<br />
       Example: `months/?startAmount=1000`
    * **endAmount=[integer]<br />**
    Filters for contributions under (but including) specified amount.<br />
       Example: `months/?endAmount=2500`
	* **limit=[integer]<br />**
    Sets limit of returned records.<br />
       Example: `months/?limit=50`
	* **offset=[integer]<br />**
    Skips ahead x returned records.<br />
       Example: `months/?offset=2500`

* **Success Response:**

  * **Code:** 200 <br />
    **Content:** 
    
    ```javascript
    {
        "sql": [QUERY SQL],
        "results": [
             {
                 "month": "0",
                 "year": "0",
                 "total": "541010.3125",
                 "count": "2"
             },
             {
                 "month": "1",
                 "year": "2013",
                 "total": "61080",
                 "count": "17"
             },
		     ...
         ]
     }
	```

* **Sample Call:**

  ```javascript
    $.ajax({
      url: "/months/3",
      dataType: "json",
      type : "GET",
      success : function(r) {
        console.log(r);
      }
    });
  ```
  
    ##Show states
  Returns json listing a collection of states and the amount raised in each, or a single state marked its abbreviation. 

* **URL**

  /states

  /states/:state

* **Method:**

  `GET`

* **URL Paths**

	* **/months/:contributor-id<br />**
    Filters to filers who have received donations from a specific contributor.<br />
       Example: `states/contributors/324`
    * **/filers/:filerid** <br />
    Filters by specific PAC or candidate.<br />
       Example: `states/filers/2009216`
    * **/candidates/:candidate-name** <br />
    Filters by specific candidate, using filerid.<br />
       Example: `states/candidates/2009216`
	* **/counties/:county** <br />
    Filters by county, using county name.<br />
       Example: `states/counties/allegheny county`    

*  **URL Params**
    * **contributorname=[string]<br />**
    Filters by contributor name (wildcarded).<br />
       Example: `states/?contributor=andrew`
    * **candidatename=[string]<br />**
    Filters by candidate name (wildcarded).<br />
       Example: `states/?candidatename=corbett`
	* **filername=[string]<br />**
    Filters by filer name (wildcarded).<br />
       Example: `states/?filername=PPG`
    * **contributor_city=[string]<br />**
    Filters by contributor's listed city (wildcarded).<br />
       Example: `states/?contributor_city=pittsburgh`
    * **contributor_zip=[string]<br />**
    Filters by contributor's listed zip code (wildcarded).<br />
       Example: `states/?contributor_zip=15222`
    * **county=[string]<br />**
    Filters by county name (wildcarded).<br />
       Example: `states/?county=allegheny`
	* **employer=[string]<br />**
    Filters by contributor's employer's name (wildcarded).<br />
       Example: `states/?employer=US Steel`
    * **startDate=[YYYY-MM-DD]<br />**
    Filters for contributions made after (and including) specified date.<br />
       Example: `states/?startDate=2014-06-01`
    * **endDate=[YYYY-MM-DD]<br />**
    Filters for contributions made before (and including) specified date.<br />
       Example: `states/?endDate=2014-10-01`
    * **startAmount=[integer]<br />**
    Filters for contributions over (but including) specified amount.<br />
       Example: `states/?startAmount=1000`
    * **endAmount=[integer]<br />**
    Filters for contributions under (but including) specified amount.<br />
       Example: `states/?endAmount=2500`
	* **limit=[integer]<br />**
    Sets limit of returned records.<br />
       Example: `states/?limit=50`
	* **offset=[integer]<br />**
    Skips ahead x returned records.<br />
       Example: `states/?offset=2500`

* **Success Response:**

  * **Code:** 200 <br />
    **Content:** 
    
    ```javascript
    {
        "sql": [QUERY SQL],
        "results": [
             {
                 "state": "AL",
                 "contributions": "3",
                 "amount": "36000",
                 "beneficiaries": [
                     {
                         "name": "Tom Corbett",
                         "filerid": "2009216",
                         "contributions": "3",
                         "amount": "36000"
                     }
                 ]
             },
             {
                 "state": "AR",
                 "contributions": "3",
                 "amount": "13000",
                 "beneficiaries": [
                     {
                         "name": "Tom Corbett",
                         "filerid": "2009216",
                         "contributions": "3",
                         "amount": "13000"
                     }
                 ]
             },
		     ...
         ]
     }
	```

* **Sample Call:**

  ```javascript
    $.ajax({
      url: "/states/PA",
      dataType: "json",
      type : "GET",
      success : function(r) {
        console.log(r);
      }
    });
  ```