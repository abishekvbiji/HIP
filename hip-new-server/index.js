var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    cors = require('cors'),
    passport = require('passport'),
    mongoose = require('mongoose'),
    random = require('random-js'),
    logger = require('morgan'),
    router = express.Router(),
    path = require('path');

var passportConfig = require('./passport-config');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/hip');
mongoose.connection.on('error', () => {
    console.log('Mongo connection error');
});

passportConfig.configure();

app.use(logger('dev'));
app.use(cors({
    origin: "http://localhost:8081",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD"]
}));
app.use(bodyParser);
app.use(passport.initialize());
app.use('/', router);
app.use(express.static(path.join(__dirname, './dist')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './dist/index.html'));
});
var server = app.listen(8081, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log('HIP server running at' + host + port);
});