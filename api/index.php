<?PHP

date_default_timezone_set("America/New_York");

// will want to add /year and /race endpoints at some point

error_reporting(E_ALL);
ini_set('display_errors', 1);


require_once "API.class.php";
class MyAPI extends API{

	public function __construct($request){
		// Call parent constructor since this one supersedes it
		parent::__construct($request);
		
		// Connect to MySql database
		require "constants.php";
		$this->mysqli = mysqli_connect($mysql_url, $mysql_user, $mysql_pwd, $mysql_database);
		if (mysqli_connect_errno($this->mysqli)) {
			echo "Failed to connect to MySQL: " . mysqli_connect_error();
		}
	}
	
	
	public function queryAPI($query, $identifier_query, $handler_function){
		// Set limit and offset to null; They can always be updated later
		$query["limit"] = " ";
		$query["offset"] = " ";
		
		// See if args exist
		if( sizeof($this -> args) > 0 ){
			// If there's only one arg, it's an identifer
			if( sizeof($this -> args) == 1 ){
				$query["where"] .= sprintf($identifier_query, $this->mysqli -> real_escape_string($this -> args[0]));
			}
			// Now we know it's a series of verbs doing their thing
			else {
				while( sizeof($this -> args) > 0 ){
					$query["where"] .= $this -> addConditions( array_shift($this -> args), array_shift($this -> args)  );
				}
			}	
		}
		
		// Check for parameters
		$query = $this -> addParameters(array_slice($this -> request, 1), $query);
		
		
		
		// Run main query
		$res = $this->mysqli -> query($query["select"] . $query["from"] . $query["join"] . $query["where"] . $query["group"] . $query["order"] . $query["limit"] . $query["offset"]);
		
		// Use special handler function if one is included, 
		// otherwise parse results the default way
		if( is_callable( $handler_function ) ) {
			return $handler_function($res, $query);
		} else {
			$results = Array();
			while($row = mysqli_fetch_assoc($res)){
				$results[] = $row;
			}
			
			// Dump query in JSON for debugging
			$output["sql"] = $this->formatSQL($query["select"] . $query["from"] . $query["join"] . $query["where"] . $query["group"] . $query["order"] . $query["limit"] . $query["offset"]);
			$output["results"] = $results;
			return $output;
		}
	}
	
	public function contributions(){
		$query["select"] = "SELECT contributions.id,
						contribution, 
						contributor,
						contributorid,
						contributions.county,
						filers.name,
						filers.filerid,
						date, 
						description ";
						
		$query["from"] = "FROM campaign_finance.contributions ";
		$query["join"] = "LEFT JOIN campaign_finance.filers on contributions.filerid = filers.filerid  ";
		$query["join"] .= "LEFT JOIN campaign_finance.candidates on contributions.filerid = candidates.filerid  ";
		$query["where"] = "WHERE 1=1 ";
		$query["group"] = " ";
		$query["order"] = "ORDER BY date DESC ";
	
		
		return $this->queryAPI($query, "AND contributions.id = '%s' ", "");
		
		
	}
	
	
	
	public function contributors(){
		$query["select"] = "SELECT contributor,
						contributions.contributorid,
						contributions.address, 
						contributions.address2,
						contributions.city,
						contributions.state,
						contributions.newzip,
						contributions.county, 
						contributions.occupation,
						contributions.empName,
						contributions.empAddress1,
						contributions.empAddress2,
						contributions.empCity,
						contributions.empState,
						contributions.empZip,
						filers.filerid,
						filers.name,
						COUNT(contribution) as contributions,
						SUM(contribution) as total_contribution ";
						
		$query["from"] = "FROM campaign_finance.contributions ";
		$query["join"] = "LEFT JOIN campaign_finance.filers on contributions.filerid = filers.filerid ";
		$query["join"] .= "LEFT JOIN campaign_finance.candidates on contributions.filerid = candidates.filerid ";
		$query["where"] = "WHERE 1=1 ";
		$query["group"] = "GROUP BY  contributor, 
							contributions.address, 
							contributions.address2,
							contributions.city,
							contributions.state,
							contributions.newzip,
							filers.filerid
							";
		$query["order"] = "ORDER BY total_contribution DESC "; 
							
		$that = $this;
		return $this->queryAPI($query, "AND contributions.contributorid = '%s' ", function($res, $query) use ($that) {
						
			$results = Array();
			while($row = mysqli_fetch_assoc($res)){
				$i = $that->search_for_value_in_array($results, "contributorid", $row["contributorid"]);
				if( $i != FALSE ) {
					$results[$i]["contributions"] += $row["contributions"];
					$results[$i]["amount"] += $row["total_contribution"];
					$results[$i]["beneficiaries"][] = Array("name" => $row["name"], "filerid" => $row["filerid"], "contributions" => $row["contributions"], "amount" => $row["total_contribution"]);
				}
				else {
					$results[] = Array("contributor" => $row["contributor"],
										"contributorid" => $row["contributorid"],
										"address" => $row["address"],
										"address2" => $row["address2"],
										"city" => $row["city"],
										"state" => $row["state"],
										"zip" => $row["newzip"], 
										"county" => $row["county"], 
										"occupation" => $row["occupation"],
										"empName" => $row["empName"],
										"empAddress1" => $row["empAddress2"],
										"empCity" => $row["empCity"],
										"empState" => $row["empState"],
										"empZip" => $row["empZip"],
										"contributions" => $row["contributions"],
										"amount" => $row["total_contribution"],
										"beneficiaries" => Array( Array("name" => $row["name"], "filerid" => $row["filerid"], "contributions" => $row["contributions"], "amount" => $row["total_contribution"]) )
										);
				}
			}
			// Dump query into JSON for debugging
			$output["sql"] = $that->formatSQL($query["select"] . $query["from"] . $query["join"] . $query["where"] . $query["group"]);
			$output["results"] = $results;
			return $output;	
			
		});
		
		

	}
	
	public function filers(){
	
		// Returns name, 
		$query["select"] = "SELECT filers.name,
						filers.filerid,
						type,
						office, 
						district,
						filers.party,
						filers.address1,
						filers.address2,
						filers.city,
						filers.state,
						filers.zip,
						county,
						phone
					";
		$query["from"] = "FROM campaign_finance.filers ";
		$query["join"] = "LEFT JOIN campaign_finance.contributions on contributions.filerid = filers.filerid ";
		$query["join"] .= "LEFT JOIN campaign_finance.candidates on contributions.filerid = candidates.filerid ";
		$query["where"] = "WHERE 1=1 ";
		$query["group"] = "GROUP BY filers.filerid";
		$query["order"] = " ";
		
		return $this->queryAPI($query, "AND filers.filerid = '%s' ", "");
	}
	
	
	// OK, so, yeah, I had hoped filers would handle this. But we need
	// some way of differentiating candidates from all the other PACS. 
	public function candidates(){
		// Returns name, 
		$query["select"] = "SELECT candidates.name,
						candidates.filerid,
						candidates.party, 
						candidates.year,
						candidates.race,
						candidates.img,
						filers.address1,
						filers.address2,
						filers.city,
						filers.state,
						filers.zip, 
						filers.phone,
						SUM(contributions.contribution) as total,
						AVG(contributions.contribution) as average,
						COUNT(contributions.contribution) as count
					";
		$query["from"] = "FROM campaign_finance.candidates ";
		$query["join"] = "LEFT JOIN campaign_finance.contributions on contributions.filerid = candidates.filerid ";
		$query["join"] .= "LEFT JOIN campaign_finance.filers on contributions.filerid = filers.filerid ";
		$query["where"] = "WHERE 1=1 ";
		$query["group"] = "GROUP BY candidates.name, candidates.year, candidates.race ";
		$query["order"] = " ";
		
		return $this->queryAPI($query, "AND candidates.filerid = '%s' ", "");
	}
	
	public function counties(){
		$query["select"] = "SELECT contributions.county,
						contributions.state,
						contributions.filerid,
						filers.name,
						filers.party,
						SUM(contributions.contribution) as total,
						AVG(contributions.contribution) as average,
						COUNT(contributions.contribution) as count
					";
		$query["from"] = "FROM campaign_finance.candidates ";
		$query["join"] = "LEFT JOIN campaign_finance.contributions on contributions.filerid = candidates.filerid ";
		$query["join"] .= "LEFT JOIN campaign_finance.filers on contributions.filerid = filers.filerid ";
		$query["where"] = "WHERE 1=1 ";
		$query["group"] = "GROUP BY contributions.county, contributions.filerid ";
		$query["order"] = "ORDER BY contributions.county ASC ";
		
		$that = $this;
		return $this->queryAPI($query, "AND contributions.county = '%s' ", function($res, $query) use ($that) {
						
			$results = Array();
			while($row = mysqli_fetch_assoc($res)){
				$i = $that->search_for_value_in_array($results, "county", $row["county"]);
				if( $i !== FALSE ) {
					
					$results[$i]["contributions"] += $row["count"];
					$results[$i]["amount"] += $row["total"];
					$results[$i]["beneficiaries"][] = Array("name" => $row["name"], "filerid" => $row["filerid"], "party" => $row["party"], "contributions" => $row["count"], "amount" => $row["total"]);
				}
				else {
					$results[] = Array("county" => $row["county"],
										"state" => $row["state"],
										"contributions" => $row["count"],
										"amount" => $row["total"],
										"beneficiaries" => Array( Array("name" => $row["name"], "filerid" => $row["filerid"], "party" => $row["party"], "contributions" => $row["count"], "amount" => $row["total"]) )
										);
				}
			}
			// Dump query into JSON for debugging
			$output["sql"] = $that->formatSQL($query["select"] . $query["from"] . $query["join"] . $query["where"] . $query["group"]);
			$output["results"] = $results;
			return $output;	
			
		});
	
	}
	
	public function states(){
		$query["select"] = "SELECT contributions.state,
						candidates.name,
						contributions.filerid,
						SUM(contributions.contribution) as total,
						COUNT(contributions.contribution) as count
					";
		$query["from"] = "FROM campaign_finance.candidates ";
		$query["join"] = "LEFT JOIN campaign_finance.contributions on contributions.filerid = candidates.filerid ";
		$query["where"] = "WHERE 1=1 ";
		$query["group"] = "GROUP BY candidates.name, contributions.state";
		$query["order"] = " ";
		
		$that = $this;
		return $this->queryAPI($query, "AND contributions.state = '%s' ", function($res, $query) use ($that) {
						
			$results = Array();
			while($row = mysqli_fetch_assoc($res)){
				
				if( $i = $that->search_for_value_in_array($results, "state", $row["state"])) {
					$results[$i]["contributions"] += $row["count"];
					$results[$i]["amount"] += $row["total"];
					$results[$i]["beneficiaries"][] = Array("name" => $row["name"], "filerid" => $row["filerid"], "contributions" => $row["count"], "amount" => $row["total"]);
				}
				else {
					$results[] = Array("state" => $row["state"],
										"contributions" => $row["count"],
										"amount" => $row["total"],
										"beneficiaries" => Array( Array("name" => $row["name"], "filerid" => $row["filerid"], "contributions" => $row["count"], "amount" => $row["total"]) )
										);
				}
			}
			// Dump query into JSON for debugging
			$output["sql"] = $that->formatSQL($query["select"] . $query["from"] . $query["join"] . $query["where"] . $query["group"]);
			$output["results"] = $results;
			return $output;	
			
		});
	}
	
	public function months(){
		$query["select"] = " SELECT
						MONTH(contributions.date) as month,
						YEAR(contributions.date) as year,
						SUM(contributions.contribution) as total,
						COUNT(contributions.contribution) as count
					";
		$query["from"] = "FROM campaign_finance.candidates ";
		$query["join"] = "LEFT JOIN campaign_finance.contributions on contributions.filerid = candidates.filerid ";
		$query["where"] = "WHERE 1=1 ";
		$query["group"] = "GROUP BY month, year ";
		$query["order"] = "ORDER BY year ASC, month ASC ";
		
		return $this->queryAPI($query, "AND MONTH(contributions.date) = %s ", "");
	}
	
	public function addConditions($category, $arg){
		switch($category){
			case "contributors":
				return "AND contributions.contributorid = '" . $this->mysqli -> real_escape_string($arg) . "' ";
			break;
			
			case "filers":
				return "AND filers.filerid = '" . $this->mysqli -> real_escape_string($arg) . "' ";
			break;
			
			case "zips":
				return "AND contributions.newzip = '" . $this->mysqli -> real_escape_string($arg) . "' ";
			break;
			
			case "states":
				return "AND contributions.state = '" . $this->mysqli -> real_escape_string($arg) . "' ";
			break;
			
			case "counties":
				return "AND contributions.county = '" . $this->mysqli -> real_escape_string($arg) . "' ";
			break;
			
			// for now, year just works with /candidates
			case "years":
				return "AND candidates.year = '" . $this->mysqli -> real_escape_string($arg) . "' ";
			break;
			
			// for now, race just works with /candidates
			case "races":
				return "AND candidates.race = '" . $this->mysqli -> real_escape_string($arg) . "' ";
			break;
			
			case "candidates":
				return "AND candidates.filerid = '" . $this->mysqli -> real_escape_string($arg) . "' ";
			break;
		}
	}
	
	public function addParameters($parameters, $query){
		if( sizeof($parameters) > 0 ){
			foreach( $parameters as $key => $value ){
				if( $value ) {
					switch($key) {
						case "contributorname":
							$query["where"] .= "AND contributions.contributor LIKE '%" . $this->mysqli -> real_escape_string($value) . "%' ";
						break;
						
						case "filername":
							$query["where"] .= "AND filers.name LIKE '%" . $this->mysqli -> real_escape_string($value) . "%' ";
						break;
						
						case "contributor_city":
							$query["where"] .= "AND contributions.city LIKE '%" . $this->mysqli -> real_escape_string($value) . "%' "; 
						break;
						
						case "contributor_zip":
							$query["where"] .= "AND contributions.zip LIKE '%" . $this->mysqli -> real_escape_string($value) . "%' "; 
						break;
						
						case "county":
							$query["where"] .= "AND contributions.county LIKE '%" . $this->mysqli -> real_escape_string($value) . "%' "; 
						break;
						
						case "employer":
							$query["where"] .= "AND contributions.empName LIKE '%" . $this->mysqli -> real_escape_string($value) . "%' "; 
						break;
						
						case "startDate":
							$value = date("Y-m-d", strtotime($value));
							$query["where"] .= "AND contributions.date >= '" . $this->mysqli -> real_escape_string($value) . "' "; 
						break;
						
						case "endDate":
							$value = date("Y-m-d", strtotime($value));
							$query["where"] .= "AND contributions.date <= '" . $this->mysqli -> real_escape_string($value) . "' "; 
						break;
						
						case "startAmount":
							$value = str_replace(",", "", $value);
							$value = floatval($value);
							$query["where"] .= "AND contributions.contribution >= " . $this->mysqli -> real_escape_string($value) . " "; 
						break;
						
						case "endAmount":
							$value = str_replace(",", "", $value);
							$value = floatval($value);
							$query["where"] .= "AND contributions.contribution <= " . $this->mysqli -> real_escape_string($value) . " "; 
						break;
						
						case "limit":
							$query["limit"] .= "LIMIT " . $this->mysqli -> real_escape_string($value) . " "; 
						break;
						
						case "offset":
							$query["offset"] .= "OFFSET " . $this->mysqli -> real_escape_string($value) . " "; 
						break;
						
						case "monthly":
							if( $value == ("true" || "TRUE") ){
							//$query["group"] 
							}
					}
				} else {
						
				}
			}
		}
		return $query;
	}
	
	public function formatSQL($sql){
		return preg_replace("/\s+/", " ", $sql);
	}
	
	public function search_for_value_in_array($array, $key, $value){
		for($i = 0; $i < count($array); $i++){
			if( array_key_exists($key, $array[$i]) ){
				if( $array[$i][$key] == $value ){
					return $i;
				}
			}
		}
		return false; 
	}
	
}

// Requests from the same server don't have a HTTP_ORIGIN header
if (!array_key_exists('HTTP_ORIGIN', $_SERVER)) {
    $_SERVER['HTTP_ORIGIN'] = $_SERVER['SERVER_NAME'];
}

try {
    $API = new MyAPI($_REQUEST['request'], $_SERVER['HTTP_ORIGIN']);
    echo $API->processAPI();
} catch (Exception $e) {
    echo json_encode(Array('error' => $e->getMessage()));
}

/*



 */


?> 