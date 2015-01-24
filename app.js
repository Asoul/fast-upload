/****** Update: 2015/01/24 ******/

var express = require('express');
var app     = express();
var port    = 8001;

var http    = require('http');
var server  = http.createServer(app);

var fs      = require('fs');
var multer  = require('multer');

var redis   = require('redis');
var db      = redis.createClient('6379', '127.0.0.1');

var morgan  = require('morgan');

/****** Confuguration ******/
// set up ejs for templating
app.set('view engine', 'ejs');

db.on("error", function(error) {
    console.log(error);
});

app.use(express.favicon(__dirname + '/public/favicon.ico')); 

// create a write stream (in append mode)
var accessLogStream = fs.createWriteStream(__dirname + '/access.log', {flags: 'a'})

// setup the logger
app.use(morgan('combined', {stream: accessLogStream}))

/****** File Transfer ******/

app.use(multer({
  dest: __dirname + '/public/uploads/',
  onFileUploadStart: function (file, res) {
    // discard the file extension for handling
    db.set(file.name, file.originalname);
    res.send(JSON.stringify({token: file.name, originalname: file.originalname}));
    
    console.log((new Date()).toLocaleString()+'[START] '+file.originalname + ' -> ' + file.name);
  },
  onFileUploadComplete: function (file) {
    console.log((new Date()).toLocaleString()+'[FINIH] '+file.originalname + ' -> ' + file.name);
  }
}));

/****** Routers ******/

app.get('/', function(req, res){
  res.render('index');
  console.log((new Date()).toLocaleString()+'[NEWON] ');
});

app.get('/favicon.ico', function(req, res){
  res.sendFile(__dirname+'/public/favicon.ico');
});

app.get('/uploads/:token', function(req, res){
  var token = req.params.token;
  db.get(token, function(err, originalname) {
    if (originalname === null) {// reply is null when the key is missing
      res.status = 404;
      res.render('404', { title:'404: Page not found', error: '404: Page not found', url: req.url });
    } else {
      console.log((new Date()).toLocaleString()+'[DONLO] '+ token + ' -> ' + originalname);
      res.download(__dirname+'/public/uploads/'+token, originalname);
    }
  });
});


// error handling middleware. Because it's
// below our routes, you will be able to
// "intercept" errors, otherwise Connect
// will respond with 500 "Internal Server Error".
app.get('*', function(req, res){
  console.log((new Date()).toLocaleString(), '[ERROR] ', req.url);
  res.status(404);

  // respond with html page
  if (req.accepts('html')) {
    res.render('404', { url: req.url });
    return;
  }

  // respond with json
  if (req.accepts('json')) {
    res.send({ error: 'Not found' });
    return;
  }

  // default to plain-text. send()
  res.type('txt').send('Not found');
});

server.listen(port, function(){
  console.log("Server listen on port: " + port);  
});