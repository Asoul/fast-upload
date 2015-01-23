var express = require('express');
var app     = express();
var port    = 8001;

var http    = require('http');
var server  = http.createServer(app);

var fs      = require('fs');
var multer  = require('multer');

var redis   = require('redis');
var db      = redis.createClient('6379', '127.0.0.1');


/* Confuguration */
app.set('view engine', 'ejs'); // set up ejs for templating
db.on("error", function(error) {
    console.log(error);
});

var file_lists = {};

/* File Transfer */

app.use(multer({
  dest: __dirname + '/public/uploads/',
  onFileUploadStart: function (file, res) {
    // discard the file extension for handling
    var newname = file.name;
    var ext;

    if (newname.indexOf('.') > 0) { ext = '.' + newname.split('.').slice(-1)[0]; }
    else { ext = ''; }
    newname = newname.replace(ext, '');

    db.set(newname, file.originalname);
    res.send(JSON.stringify({newname: newname, oldname: file.originalname}));
    
    console.log((new Date()).toLocaleString(), '[START] ', file.originalname + ' -> ' + file.name);
  },
  onFileUploadComplete: function (file) {
    console.log((new Date()).toLocaleString(), '[FINIH] ', file.originalname + ' -> ' + file.name);
  }
}));

/* Routers */

app.get('/', function(req, res){
  res.render('index');
  console.log((new Date()).toLocaleString(), '[NEWON] ');
});

app.get('/favicon', function(req, res){
  res.sendFile(__dirname+'/public/favicon.ico');
});

app.get('/uploads/:token', function(req, res){
  var token = req.params.token;
  var ext, oldname;
  db.get(token, function(err, reply) {
    // reply is null when the key is missing
    if (reply == null) {
      res.status = 404;
      res.render('error/404', { title:'404: Page not found', error: '404: Page not found', url: req.url });
    }
    oldname = reply;
    var ext;
    if (oldname.indexOf('.') > 0) { ext = '.' + oldname.split('.').slice(-1)[0]; }
    else { ext = ''; }
    console.log((new Date()).toLocaleString(), '[DONLO] ', token + ' -> ' + oldname);
    res.download(__dirname+'/public/uploads/'+token+ext, oldname);
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