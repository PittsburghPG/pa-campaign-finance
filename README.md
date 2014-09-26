Pennsylvania campaign finance tracker
========

A Post-Gazette/PublicSource collaboration cataloging campaign finance figures for the 2014 gubernatorial election (and beyond!) 

#API

##Show contributions
  Returns json listing either a collection of contributions, or a single contribution specified by an `id`. 

* **URL**

  /contributions

  /contributions/:id

* **Method:**

  `GET`

* **URL Paths**
    
    * **/contributors/:contributor-name<br />**
    Filters by specific contributor.<br />
       Example: `contributions/contributors/andrew mcgill`
    * **/filers/:filer-name** <br />
    Filters by specific PAC or candidate.<br />
       Example: `contributions/filers/Tom Wolf for Governor`
    * **/candidates/:candidate-name** <br />
    Filters by specific candidate, using their short name.<br />
       Example: `contributions/candidates/Tom Wolf`

*  **URL Params**

    * **contributor=[string]<br />**
    Filters by contributor name (wildcarded).<br />
       Example: `contributions/?contributor=andrew`
    * **filer=[string]<br />**
    Filters by filer name (wildcarded).<br />
       Example: `contributions/?filer=corbett`
    * **contributor_city=[string]<br />**
    Filters by contributor's listed city (wildcarded).<br />
       Example: `contributions/?contributor_city=pittsburgh`
    * **contributor_zip=[string]<br />**
    Filters by contributor's listed zip code (wildcarded).<br />
       Example: `contributions/?contributor_zip=15222`
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

* **Data Params**

    None

* **Success Response:**

  * **Code:** 200 <br />
    **Content:** 
            
            {
                "sql": "SELECT contributions.id, 
                               contribution, 
                               contributor, 
                               filers.name, 
                               date, 
                               description 
                        FROM campaign_finance.contributions 
                        LEFT JOIN campaign_finance.filers ON contributions.filerid = filers.filerid 
                        LEFT JOIN campaign_finance.candidates ON contributions.filerid = candidates.filerid 
                        WHERE 1=1 
                          AND candidates.name = 'Tom Corbett'",
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