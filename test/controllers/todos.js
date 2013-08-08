var controller_helper = require('./controller_helper');
var client = controller_helper.client;
var Todo = require('../../lib/models/todo');
var todo;

// Factories
var todo_factory = {
  title: 'I should pass the test',
  body: 'Wooow, i hope this will work out!'
};

describe('Todos', function() {
  describe('GET /todos', function() {
    // Add user
    beforeEach(function(done) {
      // Add factories
      Todo.create(todo_factory, function(err, t) {
        todo = t;
        done();
      });
    });

    it("returns a list of todo items", function(done) {
      client.get('/todos', function(err, req, res, data) {
        // Headers and host
        expect(res.statusCode).to.eql(200);
        expect(res.headers['content-type']).to.eql('application/json');
        // Data
        expect(data).to.have.property('todos');
        expect(data.todos.length).to.eql(1);
        expect(data.todos[0]).not.to.have.property('__v');
        expect(data.todos[0]).not.to.have.property('_id');
        expect(data.todos[0]).to.have.property('uuid').that.is.a.string;
        expect(data.todos[0]).to.have.property('title').that.is.a.string;
        expect(data.todos[0]).to.have.property('body').that.is.a.string;
        expect(data.todos[0]).to.have.property('created_at').that.is.a.date;
        expect(data.todos[0]).to.have.property('created_at').that.is.a.date;
        expect(data.todos[0]).to.have.property('completed_at').that.is.a.date;
        done();
      });
    });
  });

  describe('GET /todos/:todo', function() {
    // Add user
    beforeEach(function(done) {
      // Add factories
      Todo.create(todo_factory, function(err, t) {
        todo = t;
        done();
      });
    });

    it("returns the requested todo item", function(done) {
      client.get('/todos/' + todo.uuid, function(err, req, res, data) {
        // Headers and host
        expect(res.statusCode).to.eql(200);
        expect(res.headers['content-type']).to.eql('application/json');
        // Data
        expect(data).not.to.have.property('__v');
        expect(data).not.to.have.property('_id');
        expect(data).to.have.property('uuid').that.is.a.string;
        expect(data).to.have.property('title').that.is.a.string;
        expect(data).to.have.property('body').that.is.a.string;
        expect(data).to.have.property('created_at').that.is.a.date;
        expect(data).to.have.property('created_at').that.is.a.date;
        expect(data).to.have.property('completed_at').that.is.a.date;
        done();
      });
    });
  });

  afterEach(function(done) {
    test_helper.clearDb(done);
  });
});

after(function(done) {
  test_helper.tearDown(done);
});