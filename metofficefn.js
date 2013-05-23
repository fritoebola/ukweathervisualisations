var httputils = require('./httputils.js');
var mongoutils = require('./mongoutils.js');
var util = require('util');

var developerKey = "YOUR KEY";

//Calls callback on completion with number inserted
exports.getSiteList = function(callback) {
	var url = "http://datapoint.metoffice.gov.uk/public/data/val/wxfcs/all/json/sitelist?key=" + developerKey;
	var site;
	httputils.ukwv_getAsJson(url, function() {
		//Drop the site list, since we're rebuilding it here in a second.
		mongoutils.clearsitelist();
		if (typeof(this) === 'object' && typeof (this.Locations) === 'object'){
			for (i = 0; i < this.Locations.Location.length; i++) {
				site = this.Locations.Location[i];
				mongoutils.insertsite(site);
			}
			callback(this.Locations.Location.length);
		}
	});
};

exports.getPredictions = function(){
	mongoutils.findsites(function(){
		var site = this;
		if (typeof(site) !== 'undefined' && typeof(site.name) !== 'undefined'){
			console.log("Looking for predictions for site " + site.name );
			getPredictionsForSite(site);
		}
	});
}

var getPredictionsForSite = function(site){
	
	var period, i, j, rep;
	if (typeof (site) !== 'undefined' && typeof (site.id) !=='undefined'){
		console.time('getPredictionsForSite' + site.id);
		var url = "http://datapoint.metoffice.gov.uk/public/data/val/wxfcs/all/json/"+site.id+"?res=3hourly&key=" + developerKey;
		httputils.ukwv_getAsJson(url, function() {
			if (typeof(this) === 'object' && typeof (this.SiteRep) === 'object'){
				for (i = 0; i < this.SiteRep.DV.Location.Period.length; i++) {
					period = this.SiteRep.DV.Location.Period[i];
					for (j=0;j<period.Rep.length;j++){
						rep = period.Rep[j];
						(function(siteRep, rep, site){
							mongoutils.findForecastsForSiteOnDate(site.id, period.value, rep.$, function(err, doc){
								if (err){
									console.log("Error finding forecast "+err);
								} else {
									if (doc !== null){
										//update
										mongoutils.pushForecast(doc['_id'], siteRep.DV.dataDate, rep);
										//console.log("Pushed forecast for " + site.name);
									} else {
										//insert
										if (typeof(siteRep.DV) === 'undefined'){
											console.log(util.format("SiteRep %j", siteRep));
										} else {
											mongoutils.addForecast(site.id, siteRep.DV.dataDate, period.value, rep);
											//console.log("Inserted forecast for " + site.name);
										}


									}
								}
							});
						})(this.SiteRep, rep, site);

					}
				}
				console.timeEnd('getPredictionsForSite'+site.id);
			}
		});
	}
	
}



/*
Key to parameters:

"Wx": {
           "Param": [
               {
                   "name": "F",
                   "units": "C",
                   "$": "Feels Like Temperature"
               },
               {
                   "name": "G",
                   "units": "mph",
                   "$": "Wind Gust"
               },
               {
                   "name": "H",
                   "units": "%",
                   "$": "Screen Relative Humidity"
               },
               {
                   "name": "T",
                   "units": "C",
                   "$": "Temperature"
               },
               {
                   "name": "V",
                   "units": "",
                   "$": "Visibility"
               },
               {
                   "name": "D",
                   "units": "compass",
                   "$": "Wind Direction"
               },
               {
                   "name": "S",
                   "units": "mph",
                   "$": "Wind Speed"
               },
               {
                   "name": "U",
                   "units": "",
                   "$": "Max UV Index"
               },
               {
                   "name": "W",
                   "units": "",
                   "$": "Weather Type"
               },
               {
                   "name": "Pp",
                   "units": "%",
                   "$": "Precipitation Probability"
               }
           ]
       },
*/
