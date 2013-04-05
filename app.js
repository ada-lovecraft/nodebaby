
/**
 * Module dependencies.
 */

var express = require('express')
  , events = require('events')
  , sio = require('socket.io')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , FTP = require('jsftp');


var eventEmitter = new events.EventEmitter();
var app = express();
var server = http.createServer(app);
var io = sio.listen(server);
var serverFiles;
var ftpFiles;

server.listen(3000);

// all environments
app.set('port', process.env.PORT || 8080);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);

io.sockets.on('connection', function(socket) {
	socket.emit('files', ftpFiles);
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
  var ftp = new FTP({
  	host: 'nqhf057.dediseedbox.com',
  	user: 'codevinsky',
  	pass: 'skr4mj3t'
  });
  ftp.ls('/', function(err, files) {
  	if (err) return console.error(err)
  		ftpFiles = files;
  });
});
