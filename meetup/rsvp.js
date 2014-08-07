var request = require('request');
var db = require('../models');

var rsvpEvent = function (meetupEvent) {
  db.Key.find({where: {service: 'meetup'}}).success(function (key) {
    try{
      _rsvpEvent(meetupEvent, key.get('key'));
    } catch (e) {
      return console.error(e);
    }
  });
};

var _rsvpEvent = function (meetupEvent, key) {

  request.post("https://api.meetup.com/2/rsvp/", {
    form: {
      event_id: meetupEvent.id,
      rsvp: 'yes',
      key: key
    }
  }, function (err, httpResponse, body) {
    if (err) {
      return console.error(err);
    }
    console.log(body);
  });
};

module.exports = rsvpEvent;
