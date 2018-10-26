// Module dependencies.
const express = require('express')
    , http = require('http')
    , fs = require('fs')
    , path = require('path')
    , cons = require('consolidate')
const bodyParser = require('body-parser');
const session = require('express-session');
const app = express();
const router = express.Router();
const api = require('./app-server/routes/api');



// assign the dust engine to .dust files
app.engine('dust', cons.dust);

app.set('view engine', 'dust');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/dist', {redirect: false}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({
    secret: 'very_unique_secret_string',
    cookie: {maxAge: 1800000},
    resave: true,
    saveUninitialized: true,
}));
app.use(router);



app.use('/api', api);

// Catch all other routes and return the index file
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist/index.html'));
});

//Error handlers & middlewares
if(!process.env.NODE_ENV === 'production') {
    app.use((err, req, res) => {
        res.status(err.status || 500);

        res.json({
            errors: {
                message: err.message,
                error: err,
            },
        });
    });
}

app.use((err, req, res) => {
    res.status(err.status || 500);

    res.json({
        errors: {
            message: err.message,
            error: {},
        },
    });
});

app.listen(8000, () => {
    console.log('Server running on port: ', 8000);
});

process.on('uncaughtException', err => {
    console.log(err);
});