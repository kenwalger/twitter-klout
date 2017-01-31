#!/usr/bin/env node

/**
 * Created by Ken W. Alger on 1/30/2017.
 */


var klout = require("./twitter-klout.js");
var twitterUser = process.argv.slice(2);

twitterUser.forEach(klout.get);