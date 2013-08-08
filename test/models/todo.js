var Todo = require('../../lib/models/todo');
var todo;

// Factories
var todo_factory = {
  title: 'I should pass the test',
  body: 'Wooow, i hope this will work out!'
};

describe('Todo', function() {
  beforeEach(function(done) {
    this.timeout(100);
    // Add factories
    Todo.create(todo_factory, function(err, t) {
      todo = t;
      done();
    });
  });

  describe('Creating a new todo', function() {
    describe('with valid data', function() {
      it("should return internal mongo _id", function(done) {
        expect(todo).to.have.property('_id');
        done();
      });

      it("should have valid properties", function(done) {
        expect(todo.title).to.eql('I should pass the test');
        expect(todo.body).to.eql('Wooow, i hope this will work out!');
        done();
      });

  
      it("should have valid creation and update timestamp", function(done) {
        expect(todo).to.have.property('created_at');
        expect(todo).to.have.property('updated_at');
        done();
      });

      it("should have a valid creation date", function(done) {
        expect(todo).to.have.property('created_at');
        expect(moment(todo.created_at).isValid()).to.be.true;
        done();
      });

      it("should have a valid update date", function(done) {
        expect(todo).to.have.property('updated_at');
        expect(moment(todo.updated_at).isValid()).to.be.true;
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