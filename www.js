'use strict';

var express = require('express'),
    path = require('path'),
    routes = require('./routes/index'),
    app = express(),
    server = require('http').Server(app),
    io = require('socket.io')(server);

app.set('view engine', 'html');
app.set('views', __dirname + '/views');
app.set('view cache', true);
app.set('port', process.env.PORT || 3000);

app.use(express.static(path.join(__dirname, '/')));

app.use('/', routes);

app.use('/socket', function(req, res, next){
	io.sockets.emit('news', { key: 1 });
	res.sendStatus(200);
});

var server = server.listen(app.get('port'), function(){
	console.log('WEB started.');
});