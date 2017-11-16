'use strict';

var mongoose = require('mongoose');

var roles = {
  admin: 'admin',
  patient: 'patient'
};

var UserSchema = new mongoose.Schema({
  phoneNumber: {
    type: String
  },
  fullName: {
    type: String
  },
  dob: {
    type: Date
  },
  email: {
    type: String
  },
  provider: {
    type: String
  },
  providerAccessToken: String,
  providerRefreshToken: String,
  created: {
    type: Date,
    default: Date.now
  },
  lastAuthenticated: {
    type: Date
  },
  roles: {
    type: [String],
    default: [roles.patient]
  }
});

module.exports = mongoose.model('User', UserSchema);