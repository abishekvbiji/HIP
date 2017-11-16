var jwt = require('jsonwebtoken');
var config = require('../config');

exports.createTokenForUser = function (user, expiresInMinutes) {
  var payload = {
    roles: user.roles
  };
  var token = jwt.sign(payload, config.settings.tokenSecret, { subject: user.id, expiresIn: expiresInMinutes * 60 });
  return token;
}