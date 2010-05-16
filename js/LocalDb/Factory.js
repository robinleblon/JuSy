

// Namespace
JuSy.LocalDb = JuSy.LocalDb || {};

// API Interface
JuSy.LocalDb.InterfaceAPI = new Interface('InterfaceAPI',['isAvailable']);


/**
* Create a new instance of JuSy.LocalDb.Factory
*
* @classDescription	This class creates a factory for building a local database with the best available API
* @return {Object}	Returns a new Factory object.
* @constructor	
*/
JuSy.LocalDb.Factory = function(){

	var _availableAPIs = [];

	/** 
	* Public function that creates a local database using the best available technique
	* @return {Object}	A local database implementation
	*/
	this.getLocalDb = function(){
		_loadAPIs();
		
		if (_availableAPIs.length > 0) {
			_availableAPIs.sort(function(a,b){return a.priority-b.prority});
			return _availableAPIs[0];
		}
		
		JuSy.log("No available local db found");
		return null;
		
	} 
	
	/** 
	* Private function that loads all API's in the JuSy.LocalDb.API namespace
	* @return {Boolean}	Returns true if at least one available API could be loaded
	*/
	function _loadAPIs() {
		
		// Iterate through all objects in API	
		for (var a in JuSy.LocalDb.API) { 
			// If it's a function, it's an API
			if(typeof JuSy.LocalDb.API[a] == "function") {
				var API = new JuSy.LocalDb.API[a]();
				Interface.ensureImplements(API, JuSy.LocalDb.InterfaceAPI);
				if (API.isAvailable()) {
					_availableAPIs.push(API);
					JuSy.log("Found available API : "+API.name);
				}
			}
		}
		
	}
	
	

	// Contructor code
};