

/**
 * General logging function
 * @param {string} msg Message to be logged
 */
JuSy.log = function(msg) {
	// Only log in debugging mode
	if (JuSy.DEBUG) {
		window.console.info(msg);
	}
}

