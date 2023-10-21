(async () => {
// express server file index.js for the app
const express = require('express')
const bodyParser = require('body-parser');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const auth = require('./middleware/auth')
const app = express()
const mongoose = require('mongoose');

// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-= DB Connection -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
const mongoURI = process.env.mongoURI
await mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
console.log('Connected to MongoDB');


// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-= Middleware -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use(require('express-session')({
  secret: 'secret-key',
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set('views', './views')
app.set('view engine', 'ejs')

// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-= Routing -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
app.use('/deleteUser', require('./router/deleteUser/index.js'))
app.use('/login', auth.requireLogout, require('./router/login/index.js'))
app.use('/signup', auth.requireLogout, require('./router/signup/index.js'))
app.use('/logout', auth.requireLogin, require('./router/logout/index.js'))
app.use('/dashboard', auth.requireLogin, require('./router/dashboard/index.js'))

app.get('/', function (req, res) {
  res.send(`Hello World! 
  <a href="/login">login</a>
  <a href="/signup">signup</a>
  <a href="/dashboard">dashboard</a>
  <a href="/deleteUser">deleteUser</a>
  `)
})

app.use(express.static('public'))
const port = process.env.PORT || 3000

app.listen(port, function () {
  console.log(`Example app listening on port ${port}! \n http://localhost:${port}`)
})
})()