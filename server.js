//loads the express library to the app
var express = require("express"),
		app = express(),
		path = require('path');

//middleware to allow use of ejs
app.set("view engine", "ejs");

//allows for static files i.e... image, css and javascript files
app.use("/static", express.static("public"));

//get request to server
app.get('/', function(req,res){
	// console.log(req.body);
	res.render('index');
});

//route to ssn entry page
app.get('/ssn', function (req,res){
	res.render('ssn');
})

//route to traitify test page
app.get('/traitify', function (req,res){
	res.render('traitify');
})

//route to groups page
app.get('/groups', function (req,res){
	res.render('group');
})

//route to groups page
app.get('/employer_verify', function (req,res){
	res.render('employer_verify');
})

//connects server to local port 3000
app.listen(process.env.PORT  || 3000, function (){
  console.log("listening on port 3000");
});
