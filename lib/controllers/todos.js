var restify = require('restify');
var _       = require('underscore');
var async   = require('async');
var Todo    = require('../models/todo');

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

exports.create = function create(req, res, next){
  var title = req.params.title;
  var body  = req.params.body;
  if (typeof title === 'undefined' || title.length === 0) {
    return next(new restify.InvalidArgumentError('title argument is not present or empty'));
  } else {
    Todo.create({
      title: title,
      body: body
    }, function (err) {
      if (err) return next(err);
      res.send(200, {message: 'created'});
      return next();
    });
  }
};

exports.update = function update(req, res, next){
  var id    = req.params.id;
  var title = req.params.title;
  var body  = req.params.body;
  if (typeof title === 'undefined' || title.length === 0) {
    return next(new restify.InvalidArgumentError('title argument is not present or empty'));
  } else {
    Todo.findOneAndUpdate({
      uuid: id
    }, {
      title: title,
      body: body
    }, function(err, todo){
      if (err) return next(err);
      res.send(200, {message: 'updated'});
      return next();
    });
  }
};

exports.destroy = function destroy(req, res, next) {
  var id = req.params.id;
  Todo.findOneAndRemove({uuid: id}, function(err, todo){
    if (err) {
      return next(err);
    } else if (!todo) {
      return next(new restify.ResourceNotFoundError('not found'));
    } else {
      res.send(200, {message: 'removed'});
      return next();
    }
  });
};
