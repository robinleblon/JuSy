
// Namespace
JuSy.Storage = JuSy.Storage || {};
JuSy.Storage.Provider = JuSy.Storage.Provider || {};

// StorageProvider Interface, all local storage APIs have to implement these methods
// JuSy.Storage.ProviderInterface = new Interface('StorageProviderInterface',['isAvailable','open']);


JuSy.Storage.Provider.Gears = function(){ // implements InterfaceAPI

	this.name = "Google Gears Database";
	this._priority = 5;
	
	var _db;
	var _VERSIONS_TABLE = "jusy_versions"


	/** 
	* Checks if the specified local storage provider is available in the browser
	* @return {Boolean}	Returns true if available
	*/
	this.isAvailable = function(){
	
		// Check if it's already initialized
		if (window.google && google.gears) {
			return true;
		}
		
		var factory = null;

		// Firefox
		if (typeof GearsFactory != 'undefined') {
			factory = new GearsFactory();
		} else {
			try {
				// IE
				factory = new ActiveXObject('Gears.Factory');
				// WinCE.
				if (factory.getBuildInfo().indexOf('ie_mobile') != -1) {
					factory.privateSetGlobalObject(this);
				}
			} catch (e) {
				// Safari
				if ((typeof navigator.mimeTypes != 'undefined') && navigator.mimeTypes["application/x-googlegears"]) {
					factory = document.createElement("object");
					factory.style.display = "none";
					factory.width = 0;
					factory.height = 0;
					factory.type = "application/x-googlegears";
					document.documentElement.appendChild(factory);
					if(factory && (typeof factory.create == 'undefined')) {
						factory = null;
					}
				}
			} // end catch
		}
		
		if (!factory) {	
			return false; 
		}
		
  		if (!window.google) { google = {};}
  		if (!google.gears) { google.gears = {factory: factory};	}

		return true;
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
		_db = google.gears.factory.create('beta.database');
		_db.open(db.name);
		
		// Update to specified version
		_updateDb(db);
	}
	
	
	/** 
	* Updates the DB to the newest version
	* @param {Object} db All info to open database
	*/		
	function _updateDb(db){
	
		// Check if a comparable version number has been given
		if (!('version' in db) || isNaN(db.version)) {
			throw new Error("[JuSy.Storage.Provider.Gears] No expected version supplied, or NaN");
		}
	
		// Try to create the versions table 
		_db.execute('CREATE TABLE IF NOT EXISTS '+ _VERSIONS_TABLE +' (Id INTEGER PRIMARY KEY AUTOINCREMENT, Name TEXT NOT NULL UNIQUE, Version TEXT NOT NULL)');
		var rs = _db.execute('SELECT * FROM '+ _VERSIONS_TABLE +' WHERE Name=?', [db.name] );
		
		var currentVersion = 0;
		
		// Is there a record in the status table for this db?
		if (rs.isValidRow() && rs.fieldByName('Name') === db.name ) {
			currentVersion = parseInt(rs.fieldByName('Version'));
			JuSy.log("[JuSy.Storage.Provider.Gears] Database at version : " + currentVersion);
		} else {
			// Record not found, so we have to add is, or the update in _doMigration will fail
			_db.execute('INSERT INTO '+ _VERSIONS_TABLE +' (Name, Version) VALUES (?,?)', [db.name, '0'] );
		}
		rs.close();
		
		if (currentVersion === 0) {
			JuSy.log("[JuSy.Storage.Provider.Gears] Created new database");
		}
		
		if (currentVersion < db.version) {
		
			// Prepare versions array
			var versions = [];
			for(var v in db.migrations) {
				if (parseInt(v) > currentVersion) {
					versions.push(parseInt(v));
				}
			}
				
			// Sort array in DESCENDING order
			versions.sort(function(a,b){return (b-a);});
			
			// Run first migration
			_doMigration(versions, db.migrations, db.name);
		}
	
	}
	
	/** 
	* Runs the oldest migration, calls itself for the next migration
	* @param {Object} versions Descending array containing all version numbers found in 'migration' object
	* @param {Object} migrations Object literal, key = version numer, value = migration query
	*/	
	function _doMigration(versions, migrations, name){
		if (versions.length > 0) {
			var version = String(versions.pop());
			_db.execute(migrations[version]);
			_db.execute('UPDATE '+ _VERSIONS_TABLE +' SET Version=? WHERE Name=?;', [version, name] );
			JuSy.log("[JuSy.Storage.Provider.Gears] Database migrated to version : " + version);
			
			_doMigration(versions, migrations, name);
		}
	}





	
}