var express = require('express');
var request = require('request');
var url = require('url');

var port = Number(process.env.PORT || 5000);
var app = express();

app.use('/status', function (req, res) {
  res.statusCode = 302;
  res.setHeader('Location', getBadgeUrl());
  res.end();
});

app.listen(port, function () {
  console.log("The magic is happening on " + port);
});

var message = "";
var eventSeparator = "\n";
var meetupEvent;

var status = {
  running: true
};

try {

  request('http://stream.meetup.com/2/open_events').on('data', function(chunk) {
    message += chunk.toString();
    var eventSeparatorIndex = message.indexOf(eventSeparator);
    var didFindEvent = eventSeparatorIndex != -1;
    if (didFindEvent) {
      meetupEvent = JSON.parse(message.slice(0, eventSeparatorIndex));
      message = message.slice(eventSeparatorIndex + 1);
      processEvent(meetupEvent);
    }
  }).on('end', function () {
    throw Error();
  });

} catch (e) {
  status.running = false;
}

var getBadgeUrl = function () {
  if (status.running) {
    return 'http://img.shields.io/badge/status-running-green.svg?style=flat';
  } else {
    return 'http://img.shields.io/badge/status-stopped-red.svg?style=flat';
  }
};

var processEvent = function (meetupEvent) {
  if (meetupEvent.group.id !== 3714032) { // check for angularJS-NYC
    rsvpEvent(meetupEvent);
  }
};

var rsvpEvent = function (meetupEvent) {
  request.post("https://api.meetup.com/2/rsvp/", {
    form: {
      event_id: meetupEvent.id,
      rsvp: 'yes',
      key: '****'
    }
  }, function (err, httpResponse, body) {
    if (err) {
      status.running = false;
      return console.error(err);
    }
    console.log(body);
  });
};
