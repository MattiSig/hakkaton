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
app.use(bodyParser.json({limit: '5mb'}));
app.use(bodyParser.urlencoded({extended : true, limit: '5mb'}));


console.log("ljotur pafi");


var url = 'https://travelbriefing.org/'

var countries = 'countries.json';

var counter = 0;
var countriesJSON;

var q = async.queue(function (task, done) {
    request(task.url, function(err, res, body) {
        if (err) return done(err);
        if (res.statusCode != 200) return done(res.statusCode);
        var vacc = JSON.parse(body).vaccinations;
        var vaccNames = '';
        for(i = 0; i <= vacc.length -1; i++){
            vaccNames = vaccNames + " " + vacc[i].name;
        }
        countriesJSON[counter] = {name: countriesJSON[counter].name, vaccinations: vacc, allVaccNames: vaccNames};
        counter++;
        console.log(counter);
        done();
    });
},5);

function compareVaccines (userVaccines) {
    listOfCountires =[]
    listofCantGo = [];
    for(var i = 0; i <= countriesJSON.length - 1; i++){
        //var vaccNames = countriesJSON[1].allVaccNames;
        var canTravel = [];
        var vacc = countriesJSON[i].vaccinations;
        //console.log(vacc);
        for(var k = 0; k <= vacc.length - 1; k++){
            var bool = false;
            for(var j = 0; j <= userVaccines.length - 1; j++){    
                if(vacc[k].name === userVaccines[j]){
                    bool = true;
                    //break;
                }
            }
            canTravel.push(bool);
        }
        var yesHeCan = true;

        console.log(canTravel);
        
        for(var z = canTravel.length - 1; z >= 0; z--){
            if(!canTravel[z]){
                if(yesHeCan) {
                    listofCantGo.push({name:countriesJSON[i].name, needVacc:[vacc[z].name]});
                    yesHeCan = false;
                } else {
                    var refresh = listofCantGo.pop();
                    refresh.needVacc.push(vacc[z].name)
                    listofCantGo.push(refresh);
                }
            }
        }
        if(yesHeCan === true){ listOfCountires.push(countriesJSON[i].name)} 
    }
    console.log(listofCantGo);
    return {can : listOfCountires, cant: listofCantGo};
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
    //console.log(req.params);
    console.log(req.body);
  }
  catch(e) {
    console.error(e);
  }

  res.send(compareVaccines(["Hepatitis A", "Hepatitis B", "Tyfoid", "DTP"]));
});


app.get('/', function(req,res){
    console.log("Request!");
    console.log(compareVaccines(["Hepatitis A", "Hepatitis B", "Tyfoid", "DTP"]));
    res.send({countriesJSON});
});

app.listen('8282');
console.log('Magic happens on port 8282');
exports = module.exports = app;
