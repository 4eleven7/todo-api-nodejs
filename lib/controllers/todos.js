var restify = require('restify');
var _       = require('underscore');
var async   = require('async');
var Todo    = require('../models/todo');

function filterTodo(todo, callback) {
  callback(null, _.pick(todo, 'uuid', 'title', 'body', 'created_at', 'updated_at', 'completed'));
}

exports.list = function list(req, res, next) {
  Todo.find(function(err, todos) {
    if (err) return next(err);
    async.map(todos, filterTodo, function(err, todos){
      if (err) return next(err);
      res.send(todos);
      next();
    });
  });
};

exports.show = function show(req, res, next) {
  var id = req.params.id;
  Todo.findOne({uuid: id}, function(err, todo){
    if (err) return next(err);
    if(!todo.uuid) 
      next("Todo does not exist");

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
    }, function (err, todo) {
      if (err) return next(err);

      filterTodo(todo, function(err, todo) {
        if (err) return next(err);
        res.send(200, {message: 'created', todo: todo});
        return next();
      });
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

exports.completed = function completed(req, res, next){
  var id               = req.params.id;
  var completed        = req.params.completed;
  var response_message = '';
  if (typeof completed === 'undefined') {
    return next(new restify.InvalidArgumentError('completed attribute is not present or empty'));
  } else {
    Todo.findOneAndUpdate({
      uuid: id
    }, {
      completed: completed
    }, function(err, todo){
      if (err) return next(err);
      if (completed) {
        response_message = 'completed';
      } else {
        response_message = 'uncompleted';
      }
      res.send(200, {message: response_message});
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
