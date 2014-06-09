var ejs = require('ejs')
  , fs = require('fs')
  , login = require('login')
  , hackpad = require('hackpad')
  , dateFormat = require('dateformat')
  , getWorkspaceData = require('getWorkspaceData')
  , getMostActivePads = require('getMostActivePads')
  , getMostActiveContributors = require('getMostActiveContributors')
  , template = fs.readFileSync(__dirname + '/templates/hackpad-stats.ejs', 'utf8');

// Get the data for the specified workspace

getWorkspaceData(login.hackpad, function(err, workspaceData) {

	var stats = {};

	// Add a timestamp to the data
	var now = new Date();
	stats.timestamp = dateFormat(now, "dddd, mmmm dS, yyyy, h:MM:ss TT");

	// Get the most active contributors for the workspace
	stats.mostActiveContributors = getMostActiveContributors(workspaceData.pads);

	// Get the most active pads for the workspace
	stats.mostActivePads = getMostActivePads(workspaceData.pads);

	// get total number of pads
	stats.totalPads = workspaceData.totalPads;
	
	// Apply the data to the template
	var padContent = ejs.render(template, {data: stats} );

	// Update the stats pad using the templated data
	login.hackpad.import(login.padID, padContent, 'text/x-web-markdown', function(err, result) {
  		if(err) { return console.log("Error: "+err); }
  		console.log(result);
	});

});


