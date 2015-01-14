windows.onload(function(){
  var socket = io.connect('http://localhost:8001');
  socket.on('messages', function(data){
    console.log(data.hello);
  });
  
});