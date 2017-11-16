var mongoose = require('mongoose');

var AppointmentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: 'Appointment title required'
  },
  user: {
    id: {
      type: String,
      required: true
    },
    fullName: String
  },
  dateAndTime: {
    type: Date,
    required: true
  },
  endDateAndTime: {
    type: Date,
    required: true
  },
  remarks: String
});

AppointmentSchema.virtual('duration').get(function () {
  var durationMs = this.endDateAndTime - this.dateAndTime;
  if (durationMs) {
    return Math.abs(this.endDateAndTime - this.dateAndTime) / 1000 / 60;
  } else {
    return;
  }
});

AppointmentSchema.path('dateAndTime').validate(function (value, done) {
  return mongoose.models.Appointment.find({
    '_id': {
      $ne: this._id
    },
    'user.id': this.user.id,
    $or: [{
        dateAndTime: {
          $lt: this.endDateAndTime,
          $gte: this.dateAndTime
        }
      },
      {
        endDateAndTime: {
          $lte: this.endDateAndTime,
          $gt: this.dateAndTime
        }
      }
    ]
  }, function (err, appointments) {
    done(!appointments || appointments.length === 0);
  });
}, "The appointment overlaps with other appointments");

AppointmentSchema.path('dateAndTime').validate(function (value, done) {
  var isValid = true;
  if (value < new Date()) {
    isValid = false;
  }
  done(isValid);
}, "The appointment can not be scheduled in the past");


module.exports = mongoose.model('Appointment', AppointmentSchema);