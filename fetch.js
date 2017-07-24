/* Node Requirements */

var https = require('https'),
	fs = require('fs');



/* Fantasy namespace */

var fantasy = {};



/* Fetch Data from FPL Site */

fantasy.fetchData = function (callback) {

	var lastModified = fs.readFileSync('modified.txt', 'utf8'),
		currentTime = Math.floor(new Date() / 1000);

	if ((parseInt(lastModified, 10) + 3600) > currentTime) {
		/* no need for https request */

		callback(JSON.parse(fs.readFileSync('data.json')));
		return;
	}

	var options = {
		host: 'fantasy.premierleague.com',
		path: '/drf/bootstrap-static'
	};

	var req = https.request(options, (res) => {

		var jsonData = '';

		res.on('data', (d) => {
			jsonData += d;
		});

		res.on('end', function () {

			callback(JSON.parse(jsonData));
			console.log('file modified');
			fs.writeFile('data.json', '' + jsonData + '');
			fs.writeFile('modified.txt', Math.floor(new Date() / 1000));
		});

	});

	req.on('error', (e) => {
	    console.error(e);
	});

	req.end();
};



/* fixtures */

fantasy.getFixtures = function (callback) {

	fantasy.fetchData( function (jsonData) {

		var jsonTeams = jsonData.teams,
	  		teams = {},
	  		team,
	  		opposition,
	  		home,
	  		versusString,
	  		winloseString,
	  		loopedAlready = {},
	  		fixtures = [];

	  	for (var i = 0; i < jsonTeams.length; i += 1) {
	  		teams[jsonTeams[i].id] = jsonTeams[i];
	  	}

	  	fantasy.teams = teams;

	  	for (var id in teams) {

	  		if (loopedAlready[id]) {
	  			continue;
	  		}

	  		team = teams[id];
	  		opposition = teams[teams[id].next_event_fixture[0].opponent];
	  		home = teams[id].next_event_fixture[0].is_home;

	  		loopedAlready[opposition.id] = true;
	  		loopedAlready[id] = true;

	  		var homeAdvantage = 0,
	  			willWin = '';

	  		
  			willWin = (team.strength_overall_home * team.strength) > (opposition.strength_overall_away * opposition.strength) ? team.name : opposition.name;

  			if (home) {
  				homeAdvantage = (team.strength_overall_home) - (opposition.strength_overall_away);
  			} else {
  				homeAdvantage = (opposition.strength_overall_away) - (team.strength_overall_home);
  			}

  			var strengthGap = 0;

  			if (homeAdvantage < 0) {
	  			strengthGap -= homeAdvantage;
  			} else {
	  			strengthGap += homeAdvantage;
  			}

	  		fixtures.push({
	  			'home': home ? team.name : opposition.name,
	  			'away': home ? opposition.name : team.name,
	  			'stronger': willWin,
	  			'homeAdvantage': homeAdvantage,
	  			'strengthGap': strengthGap
	  		});

	  		fixtures.sort(function (a, b) {
				return b.strengthGap - a.strengthGap;
			});
	  	}

	  	callback(fixtures);
	  	fantasy.fixtures = fixtures;
  	});
};




/* players */

fantasy.getPlayers = function (callback) {

	console.log(fantasy.teams);

	fantasy.fetchData( function (jsonData) {

		var jsonPlayers = jsonData.elements,
			bestPlayerPoints = {},
			players = [];

		for (var i = 0; i < jsonPlayers.length; i += 1) {

				players.push({
					p: 1,
					name: jsonPlayers[i].web_name,
					points: jsonPlayers[i].total_points,
					form: parseFloat(jsonPlayers[i].form),
					ppg: jsonPlayers[i].points_per_game,
					teamId: jsonPlayers[i].team,
					cost: jsonPlayers[i].now_cost,
					teamName: fantasy.teams[jsonPlayers[i].team].name,
					position: jsonPlayers[i].element_type
				});
		}

		callback(players);

	});
};



(function () {

  	fantasy.getFixtures( function (fixtures) {

  		fs.writeFile('fixtures.json', JSON.stringify(fixtures));

	  	fantasy.getPlayers( function (players) {



	  		fs.writeFile('players.json', JSON.stringify(players));
		});
	});

 }());