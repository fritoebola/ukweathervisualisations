var MongoClient = require('mongodb').MongoClient;
var moment = require('moment');

var sitelist;
var forecasts;

// Connect to the db
MongoClient.connect("mongodb://localhost:27017/metoffice", function(err, db) {
	if (!err) {
		console.log("We are connected to MongoDB");
	}
	
	sitelist = db.collection('sitelist');
	forecasts = db.collection('forecasts');
});

/*
  TODO: Possibly want to insert into a temporary collection and then 
  switch the collections as an atomic operation, rather than simple inserts into 
  the same collection each time.
*/
exports.insertsite = function(site){
	sitelist.insert(site, {w:1}, function(err){
		if (err){
			console.log("Error inserting site " + err);
		}
	})
};

exports.clearsitelist = function(){
	sitelist.drop(function(err){
		if (err) console.log(err);
	});
};

/*
Find sites and call callback for each site.
*/
exports.findsites = function(callback){
	// All sites please
	var q = {}; 
	var cursor = sitelist.find(q);

	cursor.each(function(err, item) {
		if (err) console.log(err);
		else callback.call(item);
	});
};

//This should return a single document or null.
//callback takes err and doc as parameters
exports.findForecastsForSiteOnDate = function(locId, dateUnderForecast, timeOfDay, callback){
	forecasts.findOne({loc: locId, fcD: moment(dateUnderForecast).toDate(), t: timeOfDay}, callback);
}

//Insert a new doc
exports.addForecast = function(locId, dataDate, dateUnderForecast, prediction){
	//Add date of forecast to prediction data and remove the $
	prediction.pd = moment(dataDate).toDate();
	var timeOfDay = prediction.$;
	delete prediction.$; 
	var forecast = {
		loc: locId,
		fcD: moment(dateUnderForecast).toDate(),
		t: timeOfDay,
		d: [
			prediction
		]
	};
	forecasts.insert(forecast, {w:1}, function(err){
		if (err) console.log(err);
	});
}

//Update an existing doc with another forecast
exports.pushForecast = function(docId, dataDate, prediction){
	prediction.pd = moment(dataDate).toDate();
	delete prediction.$;
	forecasts.update({_id: docId}, {$push: {d: prediction}}, function(err){
		if (err) console.log(err);
	});
}
