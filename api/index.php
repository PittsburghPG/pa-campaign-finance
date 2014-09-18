<?PHP

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
	
	protected function contributions(){
	
		// Returns donation ID, donation amount, donation contributor, donation recipient, donation date, donation description
		$select = "SELECT id,
						contribution, 
						contributor,
						filers.name,
						date, 
						description ";
						
		$from = "FROM campaign_finance.contributions ";
		$join = "LEFT JOIN campaign_finance.filers on contributions.filerid = filers.filerid ";
		$where = "WHERE 1=1 ";
		
		// See if args exist
		if( sizeof($this -> args) > 0 ){
			// If there's only one arg, it's an identifer
			if( sizeof($this -> args) == 1 ){
				$where .= "AND id = '" . $this->mysqli -> real_escape_string($this -> args[0]) . "' ";
			}
			// Now we know it's a series of verbs doing their thing
			else {
				while( sizeof($this -> args) > 0 ){
					$where .= $this -> addConditions( array_shift($this -> args), array_shift($this -> args)  );
				}
			}
			
		}
		
		echo $select . $from . $join . $where;
		$res = $this->mysqli -> query($select . $from . $join . $where);
		$output = Array();
		while($row = mysqli_fetch_assoc($res)){
			$output[] = $row;
		}
		
		return $output;

	}
	
	protected function contributors(){
		$select = "SELECT contributor,
						contributions.address, 
						contributions.address2,
						contributions.city,
						contributions.state,
						contributions.zip
						occupation,
						empName,
						empAddress1,
						empAddress2,
						empCity,
						empState,
						empZip,
						COUNT(contribution) as contributions,
						SUM(contribution) as total_contribution ";
						
		$from = "FROM campaign_finance.contributions ";
		$join = "LEFT JOIN campaign_finance.filers on contributions.filerid = filers.filerid ";
		$where = "WHERE 1=1 ";
		$group = "GROUP BY  contributor, 
							contributions.address, 
							contributions.address2,
							contributions.city,
							contributions.state,
							contributions.zip ";
							
		// See if args exist
		if( sizeof($this -> args) > 0 ){
			// If there's only one arg, it's an identifer
			if( sizeof($this -> args) == 1 ){
				$where .= "AND contributor = '" . $this->mysqli->real_escape_string($this -> args[0]) . "' ";
			}
			// Now we know it's a series of verbs doing their thing
			else {
				while( sizeof($this -> args) > 0 ){
					$where .= $this -> addConditions( array_shift($this -> args), array_shift($this -> args)  );
				}
			}	
		}
		
		echo  $select . $from . $join . $where . $group;
		// Run main query
		$res = $this->mysqli->query($select . $from . $join . $where . $group);
		
		$output = Array();
		while($row = mysqli_fetch_assoc($res)){
			// For each row, break down how much candidate got
			$filers_array = Array();
			//echo "SELECT filers.name, SUM(contribution) as contribution " . $from . $join . $where  . " AND contributor = '" . $row["contributor"] . "' " . "GROUP BY filers.name ";
			$sub_res = $this->mysqli->query("SELECT filers.name, 
													SUM(contribution) as contribution " 
											. $from 
											. $join 
											. $where . " AND contributor = '" . $this->mysqli->real_escape_string($row["contributor"]) . "' "
											. "GROUP BY filers.name ");
			while($sub_row = mysqli_fetch_assoc($sub_res)) {
				$filers_array[] = $sub_row;
			}
			$row["beneficiaries"] = $filers_array;
			$output[] = $row;
		}
		
		return $output;

	}
	
	protected function filers(){
	
		// Returns name, 
		$select = "SELECT name,
						type,
						office, 
						district,
						party,
						filers.address1,
						filers.address2,
						filers.city,
						filers.state,
						filers.zip,
						county,
						phone
					";
		$from = "FROM campaign_finance.filers ";
		$join = "LEFT JOIN campaign_finance.contributions on contributions.filerid = filers.filerid ";
		$where = "WHERE 1=1 ";
		$group = "GROUP BY filers.filerid";
		
		// See if args exist
		if( sizeof($this -> args) > 0 ){
			// If there's only one arg, it's an identifer
			if( sizeof($this -> args) == 1 ){
				$where .= "AND name = '" . $this->mysqli -> real_escape_string($this -> args[0]) . "' ";
			}
			// Now we know it's a series of verbs doing their thing
			else {
				while( sizeof($this -> args) > 0 ){
					$where .= $this -> addConditions( array_shift($this -> args), array_shift($this -> args)  );
				}
			}	
		}
		
		echo  $select . $from . $join . $where . $group;
		// Run main query
		$res = $this->mysqli->query($select . $from . $join . $where . $group);
		$output = Array();
		while($row = mysqli_fetch_assoc($res)){
			$output[] = $row;
		}
		
		return $output;

	}
	
	protected function addConditions($category, $arg){
		switch($category){
			case "contributors":
				return "AND contributor = '" . $this->mysqli -> real_escape_string($arg) . "'";
			break;
			case "filers":
				return "AND filers.name = '" . $this->mysqli -> real_escape_string($arg) . "'";
			break;
			
			
		}
	}
	
	protected function addQueries(){
	
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