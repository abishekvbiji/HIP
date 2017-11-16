var middleware = require('./controllers/middleware');
var index = require('./controllers/index');
var auth = require('./controllers/auth');
var me = require('./controllers/me');
var appointments = require('./controllers/appointments');

module.exports = function (app) {

  app.get('/ping', function () {
    res.send('pong');
  });

  app.get('/', function (req, res) {
    res.send({
      _links: {
        self: {
          href: '/'
        },
        me: {
          href: '/me'
        },
        appointments: {
          href: '/appointments'
        }
      }
    });
  });

  app.get('/me', middleware.ensureAuthenticated, function (req, res) {
    var user = req.user;
    var result = {
      _links: {
        self: {
          href: '/users/' + user.id
        }
      },
      userId: user.userId,
      provider: user.provider,
      email: user.email,
      displayName: user.displayName,
      roles: user.roles
    };
    res.status(200).send(result);
  });

  app.get('/auth/google',
    passport.authenticate('google', {
      scope: ['email', 'profile']
    })
  );

  app.get('/auth/google/callback',
    passport.authenticate('google', {
      scope: ['email', 'profile']
    }),
    auth.externalcallback
  );

  app.post('/auth/google', auth.googletoken);

  app.get('/auth/loggedin', auth.loggedin);

  app.get('/appointments', middleware.ensureAuthenticated, function (req, res) {
    var result = {
      _links: {
        self: {
          href: '/appointments'
        }
      },
      _embedded: {
        appointment: []
      },
      count: 0
    };
    var userId = req.user.id;
    Appointment.find({
        'user.id': userId
      })
      .sort('-dateAndTime')
      .exec(function (err, appointments) {
        if (err) {
          throw err;
        }
        result.count = appointments.length;
        for (var i = 0; i < result.count; i++) {
          result._embedded.appointment.push(mapAppointment(appointments[i]));
        }
        res.status(200).send(result);
      });
  });

  app.post('/appointments', middleware.ensureAuthenticated, middleware.sanitizeRequestBody, function (req, res) {
    var newAppointment = new Appointment(req.body);
    newAppointment.user.id = req.user.id;
    newAppointment.user.fullName = req.user.fullName;
    newAppointment.save(function (err, savedAppointment) {
      if (err) {
        if (err.name === 'ValidationError') {
          res.status(422).send(err);
        } else {
          res.status(400).send(err);
        }
        return;
      }
      res.set('Location', '/appointments/' + savedAppointment.id);
      res.status(201).send(mapAppointment(savedAppointment));
    });
  });

  app.get('/appointments/:id', middleware.ensureAuthenticated, function (req, res) {
    var appointmentId = req.params.id;
    Appointment.findById(appointmentId, function (err, dbAppointment) {
      if (err) {
        throw err;
      }
      if (dbAppointment === null) {
        res.status(404).send({
          message: 'Appointment can not be found'
        });
      } else {
        res.status(200).send(mapAppointment(dbAppointment));
      }
    });
  });

  app.put('/appointments/:id', middleware.ensureAuthenticated, middleware.sanitizeRequestBody, function (req, res) {
    var appointmentId = req.params.id;
    Appointment.findById(appointmentId, function (err, dbAppointment) {
      if (err) {
        throw err;
      }
      if (dbAppointment === null) {
        res.status(404).send({
          message: 'Appointment can not be found'
        });
      } else {
        dbAppointment.set(req.body)
        dbAppointment.save(function (err, updatedDbAppointment) {
          if (err) {
            if (err.name === 'ValidationError') {
              res.status(422).send(err);
            } else {
              res.status(400).send(err);
            }
            return;
          }
          res.status(200).send(mapAppointment(updatedDbAppointment));
        })
      }
    });
  });

  app.patch('/appointments/:id', middleware.ensureAuthenticated, middleware.sanitizeRequestBody, function (req, res) {
    var appointmentId = req.params.id;
    Appointment.findById(appointmentId, function (err, dbAppointment) {
      if (err) {
        throw err;
      }
      if (dbAppointment === null) {
        res.status(404).send({
          message: 'Appointment can not be found'
        });
      } else {
        dbAppointment.set(req.body)
        dbAppointment.save(function (err, updatedDbAppointment) {
          if (err) {
            if (err.name === 'ValidationError') {
              res.status(422).send(err);
            } else {
              res.status(400).send(err);
            }
            return;
          }
          res.status(200).send(mapAppointment(updatedDbAppointment));
        })
      }
    });
  });

  app.delete('/appointments/:id', middleware.ensureAuthenticated, function (req, res) {
    var appointmentId = req.params.id;
    Appointment.findById(appointmentId, function (err, dbAppointment) {
      if (err) {
        throw err;
      }
      if (dbAppointment === null) {
        res.status(404).send({
          message: 'Appointment can not be found'
        });
      } else {
        dbAppointment.remove(function (err) {
          if (err) {
            res.status(400).send(err);
            return;
          }
          res.status(200).send({
            message: 'Appointment deleted'
          });
        })
      }
    });
  });
}