var express = require('express');
var request = require('request');
var url = require('url');

var status = require('./status');

var port = Number(process.env.PORT || 5000);

module.exports = function () {
  var app = express();

  app.use(status.app);
  app.listen(port, function () {
    console.log("The magic is happening on " + port);
  });

  var message = "";
  var eventSeparator = "\n";
  var meetupEvent;
  var eventSeparatorIndex;
  var didFindEvent

  try {

    request('http://stream.meetup.com/2/open_events').on('data', function(chunk) {
      message += chunk.toString();
      eventSeparatorIndex = message.indexOf(eventSeparator);
      didFindEvent = eventSeparatorIndex != -1;
      if (didFindEvent) {

        meetupEvent = JSON.parse(message.slice(0, eventSeparatorIndex));
        message = message.slice(eventSeparatorIndex + 1);

        if (meetupEvent.group.id === 3714032) {
          require('../meetup/rsvp')(meetupEvent);
        }

      }
    }).on('end', function () {
      throw Error();
    });

  } catch (e) {
    status._status.running = !status._status.running;
  }
};
