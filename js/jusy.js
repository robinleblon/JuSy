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
	var dbFactory = new JuSy.LocalDb.Factory();
	var db = dbFactory.getLocalDb();
	
	
	
};