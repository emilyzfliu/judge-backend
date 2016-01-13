var express = require('express');
var router  = express.Router();

var Problem = require('../models/problem');

module.exports = function(app, mountPoint) {
  router.get('/', function(req, res) {
    Problem.find(function(err, data) {
      if (err) throw err;
      res.json(data);
    })
  });

  router.post('/', function(req, res) {
    Problem.create(req.body, function(err, data) {
      if (err) throw err;
      res.json(data);
    });
  });

  app.use(mountPoint, router);
}
