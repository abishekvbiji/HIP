'use strict';

module.exports = function (app) {
    var patient = require('../controllers/patientController');

    app.get('/patients', passwordless.restricted(), patient.list_all_patients);
    app.post('/patients', passwordless.restricted(), patient.create_new_patient);

    app.get('/patients/:patientId', passwordless.restricted(), patient.get_patient_details);
    app.put('/patients/:patientId', passwordless.restricted(), patient.update_patient_details);

};