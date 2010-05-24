

window.onload = init; 
var count = 0;

var string10  = "0123456789";
var string20  = "0123456789ABCDEFGHIJ";
var string100 = "89ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";

var string1000 = string100+string100+string100+string100+string100+string100+string100+string100+string100+string100;

function init(){
	if (window.localStorage) {
		//console.log("got localstorage");
		window.localStorage.clear();
		
		//console.profile("testMaxItems 20-1000");
		var d1 = new Date();
		var t1 = d1.getTime();
		testMaxItems();
		//console.profileEnd("testMaxItems 20-1000");
		d2 = new Date();
		t2 = d2.getTime();
		
		document.getElementById('count').innerHTML = (t2-t1);
		

	}
}

function testMaxItems(){

	var tru = true;
	while (tru){
		addItem();
		//if (count % 1000 === 0)
			//console.log(count);
			
		if (count === 1000)
			tru=false;	
	}

}


function testMaxValueSize(){
		
	var key = "TestKey";
	window.localStorage.setItem(key,"TestValue-");
	
	var tru = true;
	while (tru){
		expandValue(key);
		if (count % 1000 === 0)
			console.log(count);
			
		if (count === 50000)
			tru=false;	
	}
		
}


function expandValue(key){
	var s = window.localStorage.getItem(key) + randomString(10);
	window.localStorage.setItem(key, s);
	count++;
	//document.getElementById('count').innerHTML = count;
}


function addItem() {
	window.localStorage.setItem(string20 + count, string1000 );
	count++;
		
}


function randomString(length){
    var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz'.split('');
    
    if (! length) {
        length = Math.floor(Math.random() * chars.length);
    }
    
    var str = '';
    for (var i = 0; i < length; i++) {
        str += chars[Math.floor(Math.random() * chars.length)];
    }
    return str;
}


