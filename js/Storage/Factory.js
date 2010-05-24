

// Namespace
JuSy.Storage = JuSy.Storage || {};

// API Interface
JuSy.Storage.ProviderInterface = new Interface('StorageProviderInterface',['isAvailable','open']);


/**
* Create a new instance of JuSy.LocalDb.Factory
*
* @classDescription	This class creates a factory for building a local database with the best available API
* @return {Object}	Returns a new Factory object.
* @constructor	
*/
JuSy.Storage.Factory = function(){

	var _availableProviders = [];

	/** 
	* Public function that creates a local database using the best available storage provider
	* @return {Object}	A local database implementation
	*/
	this.getLocalDb = function(){
		_loadProviders();
		
		if (_availableProviders.length > 0) {
			_availableProviders.sort(function(a,b){return a._priority-b._prority});
			return _availableProviders[0];
		}
		
		JuSy.log("[Factory] No available local db found");
		return null;
		
	} 
	
	/** 
	* Private function that loads all Providers in the JuSy.Storage.Provider namespace
	* @return {Boolean}	Returns true if at least one available provider could be loaded
	*/
	function _loadProviders() {
		
		// Iterate through all objects in the Provider namespace	
		for (var a in JuSy.Storage.Provider) { 
			// If it's a function, it's a Provider
			if(typeof JuSy.Storage.Provider[a] == "function") {
				var provider = new JuSy.Storage.Provider[a]();
				Interface.ensureImplements(provider, JuSy.Storage.ProviderInterface);
				if (provider.isAvailable()) {
					_availableProviders.push(provider);
					JuSy.log("[Jusy.Storage.Factory] Found available Storage Provider : "+provider.name);
				}
			}
		}
		
	}
	
	

	// Contructor code
};