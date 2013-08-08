var _ = require('underscore');
var async = require('async');
var Todo = require('../models/todo');

function filterTodo(todo, callback) {
  callback(null, _.pick(todo, 'uuid', 'title', 'body', 'created_at', 'updated_at', 'completed_at'));
}

exports.list = function list(req, res, next) {
  Todo.find(function(err, todos) {
    if (err) return next(err);
    async.map(todos, filterTodo, function(err, todos){
      if (err) return next(err);
      res.send({todos: todos});
      next();
    });
  });
};

exports.show = function show(req, res, next) {
  var id = req.params.id;
  Todo.findOne({uuid: id}, function(err, todo){
    if (err) return next(err);
    filterTodo(todo, function(err, todo) {
      if (err) return next(err);
      res.send(todo);
      next();
    });
  });
};
