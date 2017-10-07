var express = require('express');
var fs = require('fs');
var app     = express();
var request = require('request');
var path = require('path');


//define prefix for different units
var CHARACTER_PREFIX = "\t\t\t\t";
var LINE_PREFIX = "\n\n\t\t";
var script = "";

//use css
app.use(express.static(__dirname));
var visits = 0;

console.log("ljotur pafi");

var url = 'https://travelbriefing.org/countries.json';

app.get('/', function(req,res){
    console.log("Request!");

    request({
    url: url,
    json: true
    }, function (error, response, body) {
    if (!error && response.statusCode === 200) {
            for (var i = body.length - 1; i >= 0; i--) {
                console.log(body[i].name);
            }
        }
    });


    res.send([{kaffi :"drasl"}]);
});

app.post


app.listen('8282');
console.log('Magic happens on port 8282');
exports = module.exports = app;