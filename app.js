#!/usr/bin/env node

var klout = require("./twitter-klout.js");
var twitterUser = process.argv.slice(2);

twitterUser.forEach(klout.get);