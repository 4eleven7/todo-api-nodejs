var mongoose = require('mongoose');
var server   = require('../../lib/server');

function startServer(next) {
  server.start(next);
}

function stopServer(s, next) {
  server.stop(s, next);
}

function removeCollection(modelName, callback) {
  var model = mongoose.model(modelName);
  model.remove().exec(function(err) {
    callback(err, true);
  });
}

function clearDb(callback) {
  async.map(mongoose.modelNames(), removeCollection, function(err, results){
    callback();
  });
};

function tearDown(callback) {
  callback();
};

module.exports.startServer = startServer;
module.exports.stopServer = stopServer;
module.exports.clearDb = clearDb;
module.exports.tearDown = tearDown;