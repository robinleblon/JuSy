
// Namespace
JuSy.LocalDb = JuSy.LocalDb || {};
JuSy.LocalDb.API = JuSy.LocalDb.API || {};

// API Interface, all local storage APIs have to implement these methods
// JuSy.LocalDb.InterfaceAPI = new Interface('InterfaceAPI',['isAvailable']);


JuSy.LocalDb.API.Gears = function(){ // implements InterfaceAPI

	this.name = "Google Gears Database";
	this.priority = 10;

	/** 
	* Checks if the specified local storage API is available in the browser
	* @return {Boolean}	Returns true if available
	*/
	this.isAvailable = function(){
		if (window.google && window.google.gears) {
    		// Google Gears Database is available
    		return true;
		}
		return false;
	}


}