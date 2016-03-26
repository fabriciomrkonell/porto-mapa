'use strict';

var express = require('express'),
    path = require('path'),
    routes = require('./routes/index'),
    app = express();

app.use(express.static(path.join(__dirname, '/')));

app.set('view engine', 'html');
app.set('views', __dirname + '/views');
app.set('view cache', true);

app.use('/', routes);

app.use(function(req, res, next) {
  var err = new Error('Não encontrado!');
  err.status = 404;
  next(err);
});

app.set('port', process.env.PORT || 3000);

var server = app.listen(app.get('port'), function(){
	console.log('WEB started.');
});