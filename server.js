var express = require('express');
var fs = require('fs');
var app     = express();
var request = require('request');
var path = require('path');
var async = require('async');


//define prefix for different units
var CHARACTER_PREFIX = "\t\t\t\t";
var LINE_PREFIX = "\n\n\t\t";
var script = "";

//use css
app.use(express.static(__dirname));
var visits = 0;

console.log("ljotur pafi");

var vaccJ = [];
var url = 'https://travelbriefing.org/'

var countries = 'countries.json';

var counter = 0;
var countriesJSON;
request({
    url: url + countries,
    json: true
    }, function (error, response, body) {
    if (!error && response.statusCode === 200) {
        for (var i = 0; i <= body.length-1; i++) {
            q.push({ url: body[i].url});
        }
    } else {
        console.log(error);
    }
});
var counter = 0;
var q = async.queue(function (task, done) {
    request(task.url, function(err, res, body) {
        if (err) return done(err);
        if (res.statusCode != 200) return done(res.statusCode);

        vaccJ[counter]= {name:body.names.name, vacc:body.vaccinations};
        console.log(body.names.name);
        counter++;
        done();
    });
}, 1);

app.get('/', function(req,res){
    console.log("Request!");
    console.log(vaccJ);
    res.send(vaccJ);
});


app.listen('8282');
console.log('Magic happens on port 8282');
exports = module.exports = app;
