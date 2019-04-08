const bodyParser = require('body-parser');
const config = require('./config');
const mongoose = require('mongoose');
const express = require('express');
const app = express();
const postsRoutes = require('./api/routes/posts');
const userRoutes = require('./api/routes/user');
const mailerRoutes = require('./api/routes/mailer');

mongoose.connect(`mongodb+srv://wicode:${config.mongo.password}@wicodeblog-lxlek.mongodb.net/test?retryWrites=true`, {useNewUrlParser: true});
//mongoose.connect('mongodb://localhost:27017/wicode', {useNewUrlParser: true});

//Middle wares
app.use('/uploads', express.static('uploads'))
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if(req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PACTH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
})

app.use('/posts', postsRoutes);
app.use('/user', userRoutes);
app.use('/sendEmail', mailerRoutes);

app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
})

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        message: error.message
    })
})

module.exports = app; 
