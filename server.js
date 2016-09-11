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

//connects server to local port 3000
app.listen(process.env.PORT  || 3000, function (){
  console.log("listening on port 3000");
});
