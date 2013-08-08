restify = require('restify');

exports.client = restify.createJsonClient({
  url: 'http://127.0.0.1:8080',
  version: '*'
});
