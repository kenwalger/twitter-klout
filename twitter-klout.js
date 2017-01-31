var http = require("http");

// Print Message
function printMessage(id, network) {
	var message = "\n \n Id: " + id + "\nNetwork: " + network;
	console.log(message);
}

// Print out error messages
function printError(error) {
	console.error(error.message);
}

// Get Twitter User Data
function get(twitterUser) {
	// Connect to the Klout API with the Twitter User name
	// http://api.klout.com/v2/identity.json/twitter?screenName=twitterUser&key=KLOUT-API
	var request = http.get("http://api.klout.com/v2/identity.json/twitter?screenName="
		+ twitterUser + "&key=" + process.env.KLOUT-API, function(response){
		var body = "";
		console.log(request);
		console.log(body);
		// Read the data
		response.on('data', function (chunk) {
			body += chunk;
		});
		response.on('end', function() {
			if(response.statusCode === 200) {
				try {
					// Parse the data
					var userInfo = JSON.parse(body);
					// Print the data
					print(userInfo);
					printMessage(
						userInfo.id,
						userInfo.network
					);
				} catch(error) {
					// Parse error
					printError(error);
				}
			} else {
				// Status Code Error
				printError({
					message: "There was an error getting the information for " + twitterUser + ". ("
					+ http.STATUS_CODES [response.statusCode] + ") "
				});
			}
		});
	});
	// Connection Error
	request.on("error", printError);
}

module.exports.get = get;