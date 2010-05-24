
// Namespace
JuSy.Storage = JuSy.Storage || {};
JuSy.Storage.Provider = JuSy.Storage.Provider || {};

// StorageProvider Interface, all local storage APIs have to implement these methods
// JuSy.Storage.ProviderInterface = new Interface('StorageProviderInterface',['isAvailable','open']);


JuSy.Storage.Provider.IndexedDb = function(){ // implements InterfaceAPI

	this.name = "Indexed Database";
	this.priority = 5;

	/** 
	* Checks if the specified local storage API is available in the browser
	* @return {Boolean}	Returns true if available
	*/
	this.isAvailable = function(){
		if (window.indexedDB) {
    		// Indexed Database is available
    		return true;
		}
		return false;
	}
	
	this.open = function(){
		// TODO
	}


}