var mongoose = require ('mongoose');

function startMongoose(next) {
  var uristring = 'mongodb://localhost/todo_app';

  // Makes connection asynchronously.  Mongoose will queue up database
  // operations and release them when the connection is complete.
  mongoose.connect(uristring, function (err, res) {
    if (typeof next === 'function') {
      if (err) {
        return next(err);
      } else {
        return next(null, res);
      }
    }
  });
}

function stopMongoose(next) {
  mongoose.connection.close(function() {
    mongoose.models = {};
    mongoose.modelSchemas = {};

    if (typeof next === 'function') {
      next();
    }
  });
}

module.exports.start = startMongoose;
module.exports.stop = stopMongoose;

