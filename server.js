 /******************************************************
 * PLEASE DO NOT EDIT THIS FILE
 * the verification process may break
 
 User Story: I can get the image URLs, alt text and page urls for a set of images relating to a given search string.

User Story: I can paginate through the responses by adding a ?offset=2 parameter to the URL.

User Story: I can get a list of the most recently submitted search strings.

Example query usage:
https://img-sal.herokuapp.com/lolcats%20funny?offset=10
https://img-sal.herokuapp.com/latest

 * ***************************************************/

'use strict';

var fs = require('fs');
var express = require('express');
var app = express();


var request = require('request');
var mongoose = require('mongoose');
var api = require('./app/api.js');
var Schema = mongoose.Schema;
// Create schema
var imageSearchSchema = mongoose.Schema({
    search: String,
    time: String
});
// Turn the schema into a model
var searchModel = mongoose.model('searchModel', imageSearchSchema);
// Connect to schema model
var mongouri = process.env.MONGOLAB_URI;
// app/api.js
api(app, searchModel, request);



if (!process.env.DISABLE_XORIGIN) {
  app.use(function(req, res, next) {
    var allowedOrigins = ['https://narrow-plane.gomix.me', 'https://www.freecodecamp.com'];
    var origin = req.headers.origin || '*';
    if(!process.env.XORIG_RESTRICT || allowedOrigins.indexOf(origin) > -1){
         console.log(origin);
         res.setHeader('Access-Control-Allow-Origin', origin);
         res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    }
    next();
  });
}

app.use('/public', express.static(process.cwd() + '/public'));

app.route('/_api/package.json')
  .get(function(req, res, next) {
    console.log('requested');
    fs.readFile(__dirname + '/package.json', function(err, data) {
      if(err) return next(err);
      res.type('txt').send(data.toString());
    });
  });
  
app.route('/')
    .get(function(req, res) {
		  res.sendFile(process.cwd() + '/views/index.html');
    })

// Respond not found to all the wrong routes
app.use(function(req, res, next){
  res.status(404);
  res.type('txt').send('Not found');
});

// Error Middleware
app.use(function(err, req, res, next) {
  if(err) {
    res.status(err.status || 500)
      .type('txt')
      .send(err.message || 'SERVER ERROR');
  }  
})

app.listen(process.env.PORT, function () {
  console.log('Node.js listening ...');
});
