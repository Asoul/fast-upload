var express = require('express');
var app     = express();
var port    = process.env.PORT || 80;

var http    = require('http');
var server  = http.createServer(app);
var io      = require('socket.io')(server);

var fs      = require('fs');
var multer  = require('multer');

var session = require('express-session');
var cookieParser  = require('cookie-parser');

/* Confuguration */
app.use(express.static(require("path").join(__dirname, 'public')));
app.set('view engine', 'ejs'); // set up ejs for templating
app.use(cookieParser());
app.use(session({
  secret: 'ilovecomputernetwork',
  resave: false,
  saveUninitialized: true
}));

/* Global Variables */

var user_list = [];
var password_dict = {};

var online_list = [];

var home_messages = [];

/* Socket IO Settings */

io.on('connection', function(socket) {

  socket.on('join', function(username) {
    console.log(username + ' join!');
    // TODO: check username and tokens
    if (online_list.indexOf(username) < 0) online_list.push(username);
    socket.emit('users', user_list); 
    socket.emit('history_messages', home_messages);
    socket.broadcast.emit('new_user', username);
  });

  socket.on('message', function(message) {
    // TODO: should verify the message.user
    message.data = message.data.replace(/[Ff][Uu][Cc][Kk]/g, '****');
    socket.emit('new_message', message);
    socket.broadcast.emit('new_message', message);
    home_messages.push(message);
  })

  socket.on('dingdong', function(){
    socket.broadcast.emit('dingdong');
  });

});

/* Routers */

app.get('/', function(req, res){
  console.log("token = " + req.session.token);
  if (req.session.token !== null && online_list.indexOf(req.session.token) != -1) {
    res.render('home');
  } else {
    res.render('index');  
  }
});

app.get('/home', function(req, res){
  if (!req.session.token) res.redirect("/");
  res.render('home');
});

app.get('/upload', function(req, res){
  if (!req.session.token) res.redirect("/");
  res.render('home');
});

/* File Transfer */

app.use(multer({
  dest: __dirname + '/public/uploads/',
  onFileUploadStart: function (file) {
    console.log(file.fieldname + ' is starting ...');
  },
  onFileUploadComplete: function (file) {
    console.log(file.originalname + ' uploaded to  ' + file.path);
    var message = {user: "不知道是誰傳了一個新檔案", data: "<a href='/uploads/"+file.name+"' >"+file.originalname+"</a>"};
    io.sockets.emit('new_message', message);
    home_messages.push(message);
  }
}));

/* API Functions */

app.post('/signup/:username/:password', function(req, res) {
  var username = req.params.username;
  var password = req.params.password;
  if (!username) res.send("strange");// for bad buys
  else if (user_list.indexOf(username) >= 0) res.send("duplicated");
  else if (username.length != username.match(/[a-zA-Z0-9]*/)[0].length) {
    res.send('0-9a-zA-Z');  
  } else if (password.length != password.match(/[a-zA-Z0-9]*/)[0].length) {
    res.send('0-9a-zA-Z');  
  } else {
    user_list.push(username);
    password_dict[username] = password;
    // TODO: token should use random token, and avoid different user
    req.session.token = username;
    res.send("success");
    console.log(username + " has sugned up and logged in");
  }
});

app.post('/login/:username/:password', function(req, res) {
  var username = req.params.username;
  var password = req.params.password;
  if (!username || !password) res.send("strange");
  else if (user_list.indexOf(username) == -1) res.send("nouser");
  else if (password_dict[username] != password) res.send("failed");
  else {
    req.session.token = username;
    res.send("success");
    console.log(username + " has logged in");
  }
});

app.post('/info', function(req, res) {
  if(!req.session.token) res.send("error");
  else res.send({username: req.session.token});
});

app.post('/upload', function(req, res) {// I dont know why do there
  if(!req.session.token) res.send("error");
  console.log("req.files => "+req.files);
  res.redirect("/");
});

server.listen(port, function(){
  console.log("Server listen on port: " + port);  
});