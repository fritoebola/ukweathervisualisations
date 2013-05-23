var http = require('http');

exports.ukwv_getAsJson = function(url, callback){
    var jsonStr = '';
    http.get(url, function(res) {
	
		res.setEncoding('utf8');
		
		res.on('data', function(chunk) {
			jsonStr += chunk;
		});

		res.on('error', function(err) {
			console.log("Problem downloading JSON: %s", err);
			throw e;
		});

		res.on('end', function() {

			//try{
				var json = JSON.parse(jsonStr);
				callback.call(json);
			//} catch (err){
			//	console.log("Could not parse %s.  Headers: %j", jsonStr, res.headers);
			//}
		

		});

	});
};
