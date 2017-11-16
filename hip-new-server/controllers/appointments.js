var Appointment = require('../models/appointment');

function mapAppointment(dbAppointment) {
  var halAppointment = {
    _links: {
      self: { href: '/appointments/' + dbAppointment.id },
      user: { href: '/users/' + dbAppointment.user.id, title: dbAppointment.user.displayName }
    },
    id: dbAppointment.id,
    title: dbAppointment.title,
    dateAndTime: dbAppointment.dateAndTime,
    endDateAndTime: dbAppointment.endDateAndTime,
    duration: dbAppointment.duration,
    remarks: dbAppointment.remarks
  };
  return halAppointment;
}