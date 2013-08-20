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

function startRestify(next) {
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
  var todos = require('./controllers/todos');
  server.get('/todos', todos.list);
  server.get('/todos/:id', todos.show);
  server.post('/todos', todos.create);
  server.put('/todos/:id', todos.update);
  server.put('/todos/:id/completed', todos.completed);
  server.del('/todos/:id', todos.destroy);

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
