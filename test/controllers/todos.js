var controller_helper = require('./controller_helper');
var client            = controller_helper.client;
var Todo              = require('../../lib/models/todo');
var todo;

// Factories
var todo_factory = {
  title: 'I should pass the test',
  body: 'Wooow, i hope this will work out!'
};

describe('Todos', function() {
  afterEach(function(done) {
    test_helper.clearDb(done);
  });

  after(function(done) {
    test_helper.tearDown(done);
  });

  describe('GET /todos', function() {
    beforeEach(function(done) {
      Todo.create(todo_factory, function(err, t) {
        todo = t;
        done();
      });
    });

    it("returns a list of todo items", function(done) {
      client.get('/todos', function(err, req, res, data) {
        // Headers and host
        expect(res).to.exist;
        expect(res.statusCode).to.eql(200);
        expect(res.headers['content-type']).to.eql('application/json');
        // Data attributes
        expect(data.length).to.eql(1);
        expect(data[0]).not.to.have.property('__v');
        expect(data[0]).not.to.have.property('_id');
        expect(data[0]).to.have.property('uuid').that.is.a.string;
        expect(data[0]).to.have.property('title').that.is.a.string;
        expect(data[0]).to.have.property('body').that.is.a.string;
        expect(data[0]).to.have.property('created_at').that.is.a.date;
        expect(data[0]).to.have.property('updated_at').that.is.a.date;
        expect(data[0]).to.have.property('completed_at').that.is.a.date;
        // Data content
        expect(data[0].uuid).to.eql(todo.uuid);
        expect(data[0].title).to.eql(todo.title);
        expect(data[0].body).to.eql(todo.body);
        done();
      });
    });
  });

  describe('GET /todos/:todo', function() {
    beforeEach(function(done) {
      Todo.create(todo_factory, function(err, t) {
        todo = t;
        done();
      });
    });

    it("returns the requested todo item", function(done) {
      client.get('/todos/' + todo.uuid, function(err, req, res, data) {
        // Headers and host
        expect(res).to.exist;
        expect(res.statusCode).to.eql(200);
        expect(res.headers['content-type']).to.eql('application/json');
        // Data attributes
        expect(data).not.to.have.property('__v');
        expect(data).not.to.have.property('_id');
        expect(data).to.have.property('uuid').that.is.a.string;
        expect(data).to.have.property('title').that.is.a.string;
        expect(data).to.have.property('body').that.is.a.string;
        expect(data).to.have.property('created_at').that.is.a.date;
        expect(data).to.have.property('created_at').that.is.a.date;
        expect(data).to.have.property('completed_at').that.is.a.date;
        // Data content
        expect(data.uuid).to.eql(todo.uuid);
        expect(data.title).to.eql(todo.title);
        expect(data.body).to.eql(todo.body);
        done();
      });
    });
  });

  describe('POST /todos', function() {
    beforeEach(function(done) {
      client.get('/todos', function(err, req, res, data) {
        expect(data.length).to.eql(0);
        done();
      });
    });

    it("creates a new todo", function(done) {
      async.series([
        function (done) {
          client.post('/todos', { title: 'Mocha todo', body: 'Very nice' }, function(err, req, res, data) {
            expect(res).to.exist;
            expect(res.statusCode).to.eql(200);
            expect(data.message).to.eql('created');
            done();
          });
        },
        function (done) {
          client.get('/todos', function(err, req, res, data) {
            expect(data.length).to.eql(1);
            expect(data[0].title).to.eql('Mocha todo');
            expect(data[0].body).to.eql('Very nice');
            done();
          });
        }
      ], done);
    });

    it("returns a invalid argument error", function(done) {
      async.series([
        function (done) {
          client.post('/todos', { body: 'Very nice' }, function(err, req, res, data) {
            expect(res).to.exist;
            expect(res.statusCode).to.eql(409);
            expect(data).to.have.property('code').that.is.a.string;
            expect(data.code).to.eql('InvalidArgument');
            expect(data).to.have.property('message').that.is.a.string;
            expect(data.message).to.eql('title argument is not present or empty');
            done();
          });
        },
        function (done) {
          client.post('/todos', { title: '', body: 'Very nice' }, function(err, req, res, data) {
            expect(res).to.exist;
            expect(res.statusCode).to.eql(409);
            expect(data).to.have.property('code').that.is.a.string;
            expect(data.code).to.eql('InvalidArgument');
            expect(data).to.have.property('message').that.is.a.string;
            expect(data.message).to.eql('title argument is not present or empty');
            done();
          });
        },
        function (done) {
          client.get('/todos', function(err, req, res, data) {
            expect(data.length).to.eql(0);
            done();
          });
        }
      ], done);
    });
  });

  describe('PUT /todos/:todo', function() {
    beforeEach(function(done) {
      Todo.create(todo_factory, function(err, t) {
        todo = t;
        client.get('/todos/' + todo.uuid, function(err, req, res, data) {
          expect(data.uuid).to.eql(todo.uuid);
          expect(data.title).to.eql(todo.title);
          expect(data.body).to.eql(todo.body);
          done();
        });
      });
    });

    it("updates the todo item", function(done) {
      async.series([
        function (done) {
          client.put('/todos/' + todo.uuid, { title: 'I should be updated', body: 'My body should also be updated' }, function(err, req, res, data) {
            expect(res).to.exist;
            expect(res.statusCode).to.eql(200);
            expect(data.message).to.eql('updated');
            done();
          });
        },
        function (done) {
          client.get('/todos/' + todo.uuid, function(err, req, res, data) {
            expect(data.uuid).to.eql(todo.uuid);
            expect(data.title).to.eql('I should be updated');
            expect(data.body).to.eql('My body should also be updated');
            done();
          });
        }
      ], done);
    });

    it("returns a invalid argument error", function(done) {
      async.series([
        function (done) {
          client.put('/todos/' + todo.uuid, { body: 'Very nice' }, function(err, req, res, data) {
            expect(res).to.exist;
            expect(res.statusCode).to.eql(409);
            expect(data).to.have.property('code').that.is.a.string;
            expect(data.code).to.eql('InvalidArgument');
            expect(data).to.have.property('message').that.is.a.string;
            expect(data.message).to.eql('title argument is not present or empty');
            done();
          });
        },
        function (done) {
          client.put('/todos/' + todo.uuid, { title: '', body: 'Very nice' }, function(err, req, res, data) {
            expect(res).to.exist;
            expect(res.statusCode).to.eql(409);
            expect(data).to.have.property('code').that.is.a.string;
            expect(data.code).to.eql('InvalidArgument');
            expect(data).to.have.property('message').that.is.a.string;
            expect(data.message).to.eql('title argument is not present or empty');
            done();
          });
        },
        function (done) {
          client.get('/todos/' + todo.uuid, function(err, req, res, data) {
            expect(data.uuid).to.eql(todo.uuid);
            expect(data.title).to.eql(todo.title);
            expect(data.body).to.eql(todo.body);
            done();
          });
        }
      ], done);
    });
  });

  describe('DELETE /todos/:todo', function() {
    beforeEach(function(done) {
      Todo.create(todo_factory, function(err, t) {
        todo = t;
        client.get('/todos', function(err, req, res, data) {
          expect(data.length).to.eql(1);
          done();
        });
      });
    });

    it("destroys the requested todo item", function(done) {
      async.series([ 
        function (done) {
          client.del('/todos/' + todo.uuid, function(err, req, res, data) {
            expect(res).to.exist;
            expect(res.statusCode).to.eql(200);
            expect(data.message).to.eql('removed');
            done();
          });
        },
        function (done) {
          client.get('/todos', function(err, req, res, data) {
            expect(data.length).to.eql(0);
            done();
          });
        }
      ], done);
    });

    it("returns a resource not found error", function(done) {
      async.series([ 
        function (done) {
          client.del('/todos/123456', function(err, req, res, data) {
            expect(res).to.exist;
            expect(res.statusCode).to.eql(404);
            expect(data).to.have.property('code').that.is.a.string;
            expect(data.code).to.eql('ResourceNotFound');
            expect(data).to.have.property('message').that.is.a.string;
            expect(data.message).to.eql('not found');
            done();
          });
        },
        function (done) {
          client.get('/todos', function(err, req, res, data) {
            expect(data.length).to.eql(1);
            done();
          });
        }
      ], done);
    });
  });
});

