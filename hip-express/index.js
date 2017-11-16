var express = require('express'),
    app = express(),
    path = require('path'),
    expressSession = require('express-session'),
    bodyParser = require('body-parser'),
    passwordless = require('passwordless'),
    MongoStore = require('passwordless-mongostore'),
    Random = require('random-js'),
    os = require('os'),
    logger = require('morgan'),
    twilio = require('twilio')(
        'ACb10e07a96f8e742bbfde9e43a77975d3',
        'd8f87127299c9eccc157adc45ca0f652'
    ),
    pathToMongoDb = 'mongodb://localhost/passwordless-simple-mail',
    ejs = require('ejs'),
    mongoose = require('mongoose'),
    Patient = require('./api/models/patientModel');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/hipserver');
mongoose.connection.on('error', () => {
    console.log('MongoDB connection error. Please make sure MongoDB is running.');
    //process.exit();
});

passwordless.init(new MongoStore(pathToMongoDb));
passwordless.addDelivery(
    function (tokenToSend, uidToSend, recipient, callback) {
        twilio.messages.create({
            from: '+19142923400',
            to: recipient,
            body: "Use this token" + tokenToSend + 'to log into HIP'
        }, function (err, message) {
            callback();
        });
    }, {
        tokenAlgorithm: function () {
            var random = new Random(Random.engines.mt19937().autoSeed());
            var value = random.integer(100000, 999999);
            console.log(value);
            return value.toString();
        }
    });

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(expressSession({
    secret: '42',
    saveUninitialized: false,
    resave: false
}));
app.use(passwordless.sessionSupport());
app.use(passwordless.acceptToken({
    successRedirect: '/'
}));
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(express.static(path.join(__dirname, '../hip/dist')));

app.get('/ping', function (req, res) {
    res.json('pong');
});

app.post('/sendToken',
    passwordless.requestToken(
        function (user, delivery, callback, req) {
            // Patient.find({
            //     phoneNumber: user
            // }, callback(ret) {
            //     if (ret)
            //         callback(null, ret.id)
            //     else
            //         callback(null, null)
            // })
            callback(null, user);
        }),
    function (req, res) {
        // success!
        console.log('successful', req.passwordless.uidToAuth);
        res.json({
            success: true,
        });
    });
app.post('/verify',
    passwordless.acceptToken({
        allowPost: true,
        successRedirect: '/completeProfile',
    }),
    function (req, res) {
        //console.log(res);
        res.json({
            success: true
        })
    });

app.get('/logout',
    passwordless.logout(),
    function (req, res) {
        res.redirect('/');
    });

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist/index.html'));
});

var server = app.listen(8081, function () {
    var host = server.address().address
    var port = server.address().port

    console.log("Example app listening at http://%s:%s", host, port)
})