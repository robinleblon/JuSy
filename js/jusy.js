/**
 *	JuSy.js
 *	=======
 *
 *	Core file of library
 *	
 *	@author : Robin Leblon
 *
 **/
 
// Namespace
var JuSy = {};

// Debug flag
JuSy.DEBUG = true;

JuSy.run = function(){ 
	var dbFactory = new JuSy.Storage.Factory();
	var db = dbFactory.getLocalDb();
	
	if(db==null)
		throw new Error("Didn't find any available datasource");
	else
		JuSy.log(db.name);
	
	migrations = {
		'1' : 'CREATE TABLE IF NOT EXISTS Status (Id INTEGER PRIMARY KEY AUTOINCREMENT, Key TEXT NOT NULL)',
		'2' : 'ALTER TABLE Status ADD COLUMN Value TEXT',
		'3' : 'INSERT INTO Status (Key, Value) VALUES ("testkey", "testval")'
	};
		
	db.open({
		'name' : 'JuSy',
		'description' : 'JuSy status database',
		'size' : 1024*1024, // 1 MB should suffice
		'version' : '3',
		'migrations' : migrations
	})
		
	
};