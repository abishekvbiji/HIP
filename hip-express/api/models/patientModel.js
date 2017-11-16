'use strict';

var mongoose = require('mongoose');

var PatientSchema = new mongoose.Schema({
    phoneNumber: {
        type: String,
        required: true
    },
    fullName: {
        type: String
    },
    dob: {
        type: Date
    },
    sex: {
        type: String
    },
    email: {
        type: String
    }
});

module.exports = mongoose.model('Patients', PatientSchema);