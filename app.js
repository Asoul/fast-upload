var express = require('express');
var app     = express();
var port    = 8001;

var http    = require('http');
var server  = http.createServer(app);
// var io      = require('socket.io')(server);

var fs      = require('fs');
var multer  = require('multer');
// var autoReap  = require('multer-autoreap');

var session = require('express-session');
// var cookieParser  = require('cookie-parser');

/* Confuguration */
// app.use(express.static(require("path").join(__dirname, 'public')));
app.set('view engine', 'ejs'); // set up ejs for templating
// app.use(cookieParser());
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}))

/* Global Variables */


/* Socket IO Settings */


/* Routers */

app.get('/', function(req, res){
  res.render('index');
});

/* File Transfer */

app.use(multer({
  dest: __dirname + '/public/uploads/',
  onFileUploadStart: function (file, res) {
    res.send(file.name)
    console.log(file.fieldname + ' is starting ...' + file.name);
  },
  onFileUploadComplete: function (file) {
    console.log(file.originalname + ' uploaded to  ' + file.path);
  }
}));

/* API Functions */

app.post('/upload', function(req, res) {
  // res.send('Yo');
});

server.listen(port, function(){
  console.log("Server listen on port: " + port);  
});