
// Namespace
JuSy.LocalDb = JuSy.LocalDb || {};
JuSy.LocalDb.API = JuSy.LocalDb.API || {};

// API Interface, all local storage APIs have to implement these methods
// JuSy.LocalDb.InterfaceAPI = new Interface('InterfaceAPI',['isAvailable']);


JuSy.LocalDb.API.Html5 = function(){ // implements InterfaceAPI

	this.name = "HTML 5 Web SQL Database";
	this.priority = 1;

	/** 
	* Checks if the specified local storage API is available in the browser
	* @return {Boolean}	Returns true if available
	*/
	this.isAvailable = function(){
		if (window.openDatabase) {
    		// HTML 5 Web SQl Database is available
    		return true;
		}
		return false;
	}


}