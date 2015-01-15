var express = require('express');
var app     = express();
var port    = 8001;

var http    = require('http');
var server  = http.createServer(app);
// var io      = require('socket.io')(server);

var fs      = require('fs');
var multer  = require('multer');

// var session = require('express-session');
// var cookieParser  = require('cookie-parser');

/* Confuguration */
// app.use(express.static(require("path").join(__dirname, 'public')));
app.set('view engine', 'ejs'); // set up ejs for templating
// app.use(cookieParser());
// app.use(session({
//   secret: 'ilovecomputernetwork',
//   resave: false,
//   saveUninitialized: true
// }));

/* Global Variables */


/* Socket IO Settings */


/* Routers */

app.get('/', function(req, res){
  res.render('index');
});

/* File Transfer */

app.use(multer({
  dest: __dirname + '/public/uploads/',
  onFileUploadStart: function (file) {
    console.log(file.fieldname + ' is starting ...');
  },
  onFileUploadComplete: function (file) {
    console.log(file.originalname + ' uploaded to  ' + file.path);
    // var message = {user: "不知道是誰傳了一個新檔案", data: "<a href='/uploads/"+file.name+"' >"+file.originalname+"</a>"};
    // io.sockets.emit('new_message', message);
    // home_messages.push(message);
  }
}));

/* API Functions */

app.post('/upload', function(req, res) {// I dont know why do there
  res.redirect("/");
});

server.listen(port, function(){
  console.log("Server listen on port: " + port);  
});