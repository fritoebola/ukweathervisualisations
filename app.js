var metoffice = require('./metoffice.js');
var moment = require('moment');

metoffice.getSiteList(function(num){
	console.log("%s - Added " + num + " sites", moment().format('LLL'));
	setInterval(function(){
		console.log("%s - Fetching predictions", moment().format('LLL'));
		metoffice.getPredictions();
	}, (1000*60*60*3));
	
});
