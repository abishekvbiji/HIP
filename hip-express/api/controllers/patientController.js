'use strict';

var mongoose = require('mongoose'),
    Patient = mongoose.model('Patients');

exports.list_all_patients = function (req, res) {
    Patient.find({}, function (err, patients) {
        if (err)
            res.send(err);
        res.json(patients);
    });
};

exports.create_new_patient = function (req, res) {
    Patient.find({
        phoneNumber: req.body.phoneNumber
    }, function (err, patients) {
        if (err)
            res.send(err);
        if (patients)
            res.json({
                success: false,
                message: 'Phone number already used',
            });
        else if(!patients) {
            var new_patient = new Patient(req.body);
            new_patient.save(function (err, patient) {
                if (err)
                    res.send(err);
                res.json(patient);
            });
        }
    });
    var new_patient = new Patient(req.body);
    new_patient.save(function (err, patient) {
        if (err)
            res.send(err);
        res.json(patient);
    });
};

exports.get_patient_details = function (req, res) {
    Patient.findById(req.body.patientId, function (err, patient) {
        if (err)
            res.send(err);
        res.json(patient);
    });
};

exports.update_patient_details = function (req, res) {
    Patient.findOneAndUpdate({
        _id: req.body.patientId
    }, req.body, {
        new: true
    }, function (err, patient) {
        if (err)
            res.send(err);
        res.json(patient);
    });
};