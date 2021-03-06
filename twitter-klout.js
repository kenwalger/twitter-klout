/**
 * Created by Ken W. Alger on 1/30/2017.
 */


var http = require("http");
var config = require("./config.js");
var os = require("os"), EOL = os.EOL;

// Print Message
function printMessage(username, score, day, week, month) {
	var message = EOL + "The Klout score for Twitter user @" + username + " is: " + score + EOL + EOL
		+ "Their score has changed: "+ EOL + EOL
		+ day + " in the last day, "+ EOL + EOL
		+ week + " in the last week, and " + EOL + EOL
		+ month + " in the last month.";
	console.log(message);
}

// Print out error messages
function printError(error) {
	console.error(error.message);
}

// Convert Twitter username to Klout ID
function get(twitterUser) {
	// Connect to the Klout API with the Twitter User name
	// http://api.klout.com/v2/identity.json/twitter?screenName={twitterUser}&key={KLOUT-API-KEY}
	var request = http.get("http://api.klout.com/v2/identity.json/twitter?screenName="
		+ twitterUser + "&key=" + config.klout.api_key, function (response) {
			var body = "";
			// Read the data
			response.on('data', function (chunk) {
				body += chunk;
			});
			response.on('end', function () {
				if (response.statusCode === 200) {
					try {
						// Parse the data
						var userInfo = JSON.parse(body);
						// Get Klout Score and print the message
						getKlout(userInfo.id, function (klout) {
							printMessage(
								twitterUser,
								klout.score,
								klout.scoreDelta.dayChange,
								klout.scoreDelta.weekChange,
								klout.scoreDelta.monthChange
							);
						});
					} catch (error) {
						// Parse error
						printError(error);
					}
				} else {
					// Status Code Error
					printError({
						message: "There was an error getting the information for " + twitterUser + ". ("
						+ http.STATUS_CODES[response.statusCode] + ") "
					});
				}
			});
		});
	// Connection Error
	request.on("error", printError);
}

function getKlout(id, callback) {
	// Connect to Klout API with id
	// http://api.klout.com/v2/user.json/{id}/score?key={KLOUT-API-KEY}
	var request = http.get("http://api.klout.com/v2/user.json/"
		+ id + "/score?key=" + config.klout.api_key, function (response) {
			var body = "";
			// Read the data
			response.on('data', function (chunk) {
				body += chunk;
			});
			response.on('end', function () {
				if (response.statusCode === 200) {
					try {
						callback(JSON.parse(body));
					} catch (error) {
						// Parse Error
						printError(error);
					}
				} else {
					// Status Code Error
					printError({
						message: "There was an error getting the Klout information of " + id + ". ("
						+ http.STATUS_CODES[response.statusCode] + ") "
					});
				}
			});
		});
	// Connection Error
	request.on("error", printError);
}

module.exports.get = get;
