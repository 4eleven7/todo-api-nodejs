var mongoose = require('mongoose');
var uuid     = require('node-uuid');

// Todo schema
var todo_schema = new mongoose.Schema({
  uuid: { type: String, index: { unique: true }  },
  title: { type: String, default: '' },
  body: { type: String, default: '' },
  completed: { type: Boolean },
  created_at: { type: Date },
  updated_at: { type: Date }
});

// before save
todo_schema.pre('save', function(next) {
  if (!this.isNew)
    return next();
  this.setDefaults();
  this.createTimestamps();
  this.createUUID();
  next();
});

todo_schema.methods = {
  setDefaults: function() {
    this.completed = false;
  },
  createTimestamps: function() {
    this.updated_at = new Date;
    if (!this.created_at) {
      this.created_at = new Date;
    }
  },
  createUUID: function() {
    var buffer = new Buffer(32);
    var user_uuid = uuid.v4(null, buffer, 0);
    this.uuid = uuid.unparse(user_uuid);
  }
};

module.exports = mongoose.model('Todo', todo_schema);
