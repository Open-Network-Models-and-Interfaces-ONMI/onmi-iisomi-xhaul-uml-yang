var express = require('express');
var http = require('http');
var os = require('os');
var fs = require('fs');

var port = 8080;
var logo = 
                [
                    ' ', 
                    '         .__     __   _________      .__          __  .__                      ',
                    '         |  |___/  |_/   _____/ ____ |  |  __ ___/  |_|__| ____   ____   ______',
                    '         |  |  \\   __\\_____  \\ /  _ \\|  | |  |  \\   __\\  |/  _ \\ /    \\ /  ___/',
                    '         |   Y  \\  | /        (  <_> )  |_|  |  /|  | |  (  <_> )   |  \\\\___ \\ ',
                    '         |___|  /__|/_______  /\\____/|____/____/ |__| |__|\\____/|___|  /____  >',
                    '              \\/            \\/                                       \\/     \\/ ',
                    ' ',
                ];

var showInfo = function() {
    var message = logo;
    message.push('+------------------------------------------------------------------------------------------+');
    message.push('|                                                                                          |');
    message.push('|  http express server listening on ' + JSON.stringify(server.address()));
    message.push('|  http://' + os.hostname() + ':' + server.address().port);
    message.push('|                                                                                          |');
    message.push('+------------------------------------------------------------------------------------------+');
    console.log(message.join('\n'));
};

// Create a service (the app object is just a callback).
var app = express();

app.use('/bower_components', express.static('bower_components'));
app.use('/images', express.static('images'));
app.use('/scripts', express.static('scripts'));
app.use('/stylesheets', express.static('stylesheets'));
app.use('/modules', express.static('modules'));

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

// Create an HTTP service.
var server = http.createServer(app).listen(port, function() {
    showInfo();
});
