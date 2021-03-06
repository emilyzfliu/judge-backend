var express = require('express');
var router = express.Router();

var Contest = require('../models/contest');

module.exports = function (app, mountPoint) {
  router.get('/', function (req, res) {
    Contest.find(function (err, data) {
      if (err) {
        return res.status(500).json(err);
      }
      res.json(data);
    });
  });

  router.get('/withProblems/:id', function (req, res) {
    Contest.findWithProblems(req.params.id, function (err, contest) {
      if (err) {
        return res.status(500).json(err);
      }
      res.json(contest);
    });
  });

  router.get('/:id', function (req, res) {
    Contest.find({_id: req.params.id}, function (err, ans) {
      if (err) {
        return res.status(500).json(err);
      }
      return res.json(ans[0]);
    });
  });

  router.post('/', function (req, res) {
    Contest.create(req.body, function (err, data) {
      if (err) {
        return res.status(500).json(err);
      }
      res.json(data);
    });
  });

  router.post('/:id/add', function (req, res) {
    Contest.find({_id: req.params.id}, function (err, ans) {
      if (err) {
        return res.status(500).json(err);
      }
      var contest = ans[0];
      if (!Array.isArray(req.body)) {
        req.body = [req.body];
      }

      contest.addProblems(req.body, function (err, data) {
        if (err) {
          return res.status(500).json(err);
        }
        res.json({
          ok: true,
          data: data
        });
      });
    });
  });

  router.put('/:id', function (req, res) {
    Contest.update({_id: req.params.id}, req.body, function (err, data) {
      if (err) {
        return res.status(500).json(err);
      }
      res.json(data);
    });
  });

  router.delete('/:id', function (req, res) {
    Contest.remove({_id: req.params.id}, function (err, data) {
      if (err) {
        return res.status(500).json(err);
      }
      res.json(data);
    });
  });

  app.use(mountPoint, router);
};
