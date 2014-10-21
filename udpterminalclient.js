var dgram = require('dgram');
var server = dgram.createSocket("udp4");
var readline = require('readline');

server.on("error", function (err) {
  console.log("server error:\n" + err.stack);
  server.close();
});

server.on("message", function (msg, rinfo) {

var response = msg.toString();
//var stdout = [];

if ( response.match(/Goodbye./) ) {
  console.log(response);
  process.exit();
}

if ( response.match(/#:/) ) {

/*
if ( stdout ) {
   console.log(stdout);
}
*/
var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
//console.log(response);

  rl.question(response, function(answer) {
  if ( ! answer ) { answer ="blank"; }
  rl.close();
    if ( answer === "exit" ) {
      var message = new Buffer("EXIT");
    }
    else {
      var message = new Buffer(answer);
    }
  server.send(message, 0, message.length, 9000, "192.168.122.1", function(err, bytes) { });

  });

}

else if ( response === "serverattached" ) {
  console.log("Logged in:");
  var message = new Buffer("Ready");
  server.send(message, 0, message.length, 9000, "192.168.122.1", function(err, bytes) {
    if (err) {
      console.log(err);
    }
  //server.close();
  });
}
else {
  console.log(response);
  //stdout.push(response);
}

});

server.on("listening", function () {
  var address = server.address();
  var message = new Buffer("clientattached");
  server.send(message, 0, message.length, 9000, "192.168.122.1", function(err, bytes) {
    if (err) {
      console.log(err);
  }
});


});



server.bind(9001);
