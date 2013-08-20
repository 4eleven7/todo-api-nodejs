var async          = require('async');
var mongooseHelper = require('./mongoose');
var restify        = require('restify');
var bunyan         = require('bunyan');

// Don't die on me
// process.on('uncaughtException', function (err) {
//   console.error(err);
//   console.log("Node NOT Exiting...");
// });

var Logger = bunyan.createLogger({
  name: 'TodoLogger',
  streams: [{
    path: 'logs/development.log'
  }],
  level: 'debug'
});

function startSocketIo(server, next) {
  // ------------------------------------
  // Socket.io
  // ------------------------------------
  var io = require('socket.io').listen(server);
  var trusted_origin = '0.0.0.0:3000';

  // Allow access from trusted origin
  io.set('origins', trusted_origin);
  // Allow handshake from trusted origin
  io.set('authorization', function (handshakeData, accept) {
    if (handshakeData.headers.origin != 'http://'+trusted_origin) {
      accept('Origin is not allowed.', false);
    } else {
      accept(null, true);
    }
  });

  next(io);
}

function startRestify(next) {
  // ------------------------------------
  // Restify server
  // ------------------------------------
  var server = restify.createServer({
    name: 'Todo',
    version: '0.0.1'
  });

  // ------------------------------------
  // Middleware
  // ------------------------------------
  server.use(restify.CORS());
  server.use(restify.acceptParser(server.acceptable));
  server.use(restify.queryParser());
  server.use(restify.bodyParser());

  // ------------------------------------
  // Routes
  // ------------------------------------

  startSocketIo(server, function (io) {
    var todos = require('./controllers/todos')(io);
    server.get('/todos', todos.list);
    server.get('/todos/:id', todos.show);
    server.post('/todos', todos.create);
    server.put('/todos/:id', todos.update);
    server.put('/todos/:id/completed', todos.completed);
    server.del('/todos/:id', todos.destroy);
  });

  // Logging of requests
  server.on('after', restify.auditLogger({
    log: Logger
  }));

  // Start server
  server.listen(8080, function () {
    next(server);
  });
}

function stopRestify(server, next) {
  server.close(function() {
    if (typeof next === 'function') {
      next();
    }
  });
}

function start(next) {
  async.series([
    mongooseHelper.start,
    startRestify
  ], function(server) {
    if (typeof next === 'function') {
      next(server);
    }
  });
}

function stop(server, next) {
  async.series([
    mongooseHelper.stop,
    async.apply(stopRestify, server)
  ], function() {
    if (typeof next === 'function') {
      next();
    }
  });
}

module.exports.start = start;
module.exports.stop = stop;
