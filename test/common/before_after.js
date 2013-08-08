var server;

before(function(done){
  test_helper.startServer(function(s) {
    server = s;
    done();
  });
});

after(function(done) {
  // FIXME: restify server.stop does not play nice!
  this.timeout(600);
  setTimeout(done, 500);
  test_helper.stopServer(server);
});
