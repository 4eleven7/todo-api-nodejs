var server = require('./lib/server');

server.start(function(server) {
  console.error('%s listening at %s', server.name, server.url);
});