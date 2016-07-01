'use strict';

var express = require('express'),
    path = require('path'),
    routes_index = require('./routes/index'),
    routes_home = require('./routes/home'),
    routes_area = require('./routes/area'),
    routes_router = require('./routes/router'),
    routes_badge = require('./routes/badge'),
    app = express(),
    server = require('http').Server(app),
    io = require('socket.io')(server),
    mongoose = require('mongoose'),
    db = mongoose.connection,
    passport = require('passport'),
    compression = require('compression'),
    bodyParser = require('body-parser'),
    expressSession = require('express-session'),
    RedisStore = require('connect-redis')(expressSession),
    LocalStrategy = require('passport-local').Strategy,
    service = require('./services/service'),
    contrab = require('./services/contrab'),
    User = require('./models/user');

mongoose.connect('mongodb://10.0.109.113:27017/porto-mapa');
//mongoose.connect('mongodb://192.168.1.189:27017/porto-mapa');

db.on('error', function(){
  console.log('Database: error.');
}).once('open', function() {
  console.log('Database: success.');
});

app.use(compression());
app.set('view engine', 'html');
app.set('views', __dirname + '/views');
app.set('view cache', true);
app.set('port', process.env.PORT || 3000);

app.use(express.static(path.join(__dirname, '/')));
app.use(require('morgan')('combined'));
app.use(require('cookie-parser')());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Passport
app.use(expressSession({ store: new RedisStore({
  host: '127.0.0.1',
  port: 6379
}), secret: 'secret-key' }));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use('/', routes_index);
app.use('/', service.isAutenticate, routes_home);
app.use('/area', service.isAutenticate, routes_area);
app.use('/router', service.isAutenticate, routes_router);
app.use('/badge', service.isAutenticate, routes_badge);

app.get('/socket', function(req, res, next){
	io.sockets.emit('news', { key: 1 });
	res.sendStatus(200);
});

var server = server.listen(app.get('port'), function(){
	console.log('WEB started.');
    contrab.start(io);
});