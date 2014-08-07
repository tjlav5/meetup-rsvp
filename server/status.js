var express = require('express');

var _running = true;

var Status = function () {
  this.running = true;
};

Status.prototype.getBadgeUrl = function () {
  if (this.running) {
    return 'http://img.shields.io/badge/status-running-green.svg?style=flat';
  } else {
    return 'http://img.shields.io/badge/status-stopped-red.svg?style=flat';
  }
};

var status = new Status();

var app = express()
          .use('/status', function (req, res) {
            res.statusCode = 302;
            res.setHeader('Location', status.getBadgeUrl());
            res.end();
          });

module.exports = {
  _status: status,
  app: app
}
