var express = require('express');
var fs = require('fs');
var app     = express();
var request = require('request');
var path = require('path');
var async = require('async');
var bodyParser = require('body-parser');


//define prefix for different units
var CHARACTER_PREFIX = "\t\t\t\t";
var LINE_PREFIX = "\n\n\t\t";
var script = "";

//use css
app.use(express.static(__dirname));
var visits = 0;

// IP 130.208.244.125
// use bodyParser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));


console.log("ljotur pafi");


var url = 'https://travelbriefing.org/'

var countries = 'countries.json';

var counter = 0;
var countriesJSON;

var q = async.queue(function (task, done) {
    request(task.url, function(err, res, body) {
        if (err) return done(err);
        if (res.statusCode != 200) return done(res.statusCode);
        //console.log(JSON.parse(body).vaccinations);
        countriesJSON[counter] = {name: countriesJSON[counter].name, vaccinations:JSON.parse(body).vaccinations};
        counter++;
        done();
    });
},5);

function compareVaccines (userVaccines) {
  // { 'userVaccines[]': [ 'Cholera', 'Hepatitis A', 'Malaria' ] }
  
}

request({
    url: url + countries,
    json: true
    }, function (error, response, body) {
    if (!error && response.statusCode === 200) {
        countriesJSON = body;
        for (var i = 0; i <= countriesJSON.length -1; i++) {
            q.push({ url: countriesJSON[i].url});
        }
    } else {
        console.log(error);
    }

});

app.post('/', function(req, res) {

  try {
    //console.log(req.body);
    console.log(req.params);
    console.log(req.body);
  }
  catch(e) {
    console.error(e);
  }

  res.send(countriesJSON);
});


app.get('/', function(req,res){
    console.log("Request!");
    res.send(countriesJSON);
});


app.listen('8282');
console.log('Magic happens on port 8282');
exports = module.exports = app;
