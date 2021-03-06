const express = require('express'),
    path = require('path'),
    logger = require('morgan'),
    cors = require('cors'),
    mongoose = require('mongoose'),
    helmet = require('helmet'),
    passport = require('./passport'),
    __CONFIG__ = require('./config');

const indexRouter = require('./routes/index'),
    mailRouter = require('./routes/mail'),
    projectsRouter = require('./routes/projects'),
    usersRouter = require('./routes/users')

const app = express();

// Fixed mongoose deprecation error
mongoose.set('useCreateIndex', true);

// Connecting to server
if (process.env.PROD) {
    console.log("Trying to connect to production DB...")
    mongoose.connect(__CONFIG__.mongoProdUrl, { useNewUrlParser: true, useUnifiedTopology: true }).then(db => console.log('Connected to MongoDB...')).catch(err => console.error(err))
} else {
    console.log("Trying to connect to development DB...")
    mongoose.connect(__CONFIG__.mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true }).then(db => console.log('Connected to MongoDB...')).catch(err => console.error(err))
}

// Helmet setup
app.use(helmet())

// CORS setup
app.use(cors())

// Enables logger in development mode
if (!process.env.PROD)
    app.use(logger('dev'));

app.use(passport.initialize()) // Inits passport
passport.createLocalStrategy() // Creates a local strategy
passport.createJwtStrategy() // Creates a JWT Strategy

app.use(express.json({ limit: '12mb' }))
app.use(express.urlencoded({ limit: '12mb', extended: true }))

// Static path
app.use(express.static(path.join(__dirname, 'public')));

/* Routes  */
app.use('/', indexRouter);
app.use('/mail', mailRouter)
app.use('/projects', projectsRouter)
app.use('/users', usersRouter)

module.exports = app;
