
// Namespace
JuSy.Storage = JuSy.Storage || {};
JuSy.Storage.Provider = JuSy.Storage.Provider || {};

// StorageProvider Interface, all local storage APIs have to implement these methods
// JuSy.Storage.ProviderInterface = new Interface('StorageProviderInterface',['isAvailable','open']);


JuSy.Storage.Provider.Html5 = function(){ // implements StorageProviderInterface

	this.name = "HTML 5 Web SQL Database";
	this._priority = 1;
	var _db;


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
	
	
	/** 
	* Creates or upgrades database to most recent schema
	* @param {Object} db All info to open database
	* @return {Boolean}	Returns true if most recent db succesfully opened
	*/
	this.open = function(db){
		
		// Sanitize input
		if (typeof db.name === 'undefined') {
			 throw new Error("[Html5Db] Tried to open database without supplying a unique name");
		}
		
		if (typeof db.migrations === 'undefined' ) {
			 throw new Error("[Html5Db] Tried to open database without at least one migration");
		}

		db.size =  !('size' in db) || isNaN(db.size) ? 5*1024*1024 : db.size;
		db.description = ('description' in db) ? db.description : db.name;
		
		// Open the DB without a specific version
		_db = openDatabase(db.name, '', db.description, db.size);
		
		// Update to specified version
		_updateDb(db.migrations, parseInt(db.version));

	}
	
	
	/** 
	* Updates the DB to the newest version
	* @param {Object} migrations Object literal, key = version numer, value = migration query
	* @param {String} expectedVersion Version to update the db to
	*/		
	function _updateDb(migrations, expectedVersion){
	
		var currentVersion = (_db.version === '') ? 0 : _db.version;
		
		if (currentVersion === 0) {
			JuSy.log("[Html5Db] Created new database");
		}
		
		if (currentVersion < expectedVersion) {
	
			// Prepare versions array
			var versions = [];
			for(var v in migrations) {
				if (parseInt(v) > currentVersion) {
					versions.push(parseInt(v));
				}
			}
				
			// Sort array in DESCENDING order
			versions.sort(function(a,b){return (b-a);});
					
			// Run initial migration
			_doMigration(versions, migrations);
		}
	
	}
	
	
	/** 
	* Runs the oldest migration, calls itself for the next migration
	* @param {Object} versions Descending array containing all version numbers found in 'migration' object
	* @param {Object} migrations Object literal, key = version numer, value = migration query
	*/	
	function _doMigration(versions, migrations){
	
		if (versions.length > 0) {
			var version = String(versions.pop());
			_db.changeVersion(_db.version, version,
				function(tx){ // transaction
					tx.executeSql(migrations[version]);
				},
				function(err){ // error
					JuSy.log(err);
				},
				function(){ // success
					JuSy.log("[Html5Db] Database migrated to version : " + version);
					_doMigration(versions, migrations);
				}
			); // end changeVersion()
		} // end if
		
	}


}