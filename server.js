var express = require('express');
var app = express();
var path = require('path');
var port     = process.env.PORT || 8080;
var logger = require('morgan');
var bodyParser = require('body-parser');
var api = require('./scripts/api');


// use ===============================================================
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(express.static(__dirname + '/views'));
app.use(express.static(__dirname + '/static'));

// routes =============================================================
app.get('/',function(req,res){
	res.sendFile('index.html');
});

app.get('/api',function(req,res){
	//an list of functionality
	var testList = ["VariableDeclaration","ForStatement"];
	//user's input
	var content = req.query.content;
	//make api call
	var feedback = api.checkWhitelist(content,testList);
	res.send(feedback);
});

// launch ======================================================================
app.listen(port);