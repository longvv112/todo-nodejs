const path = require('path');
const express = require('express');
const mustacheExpress = require('mustache-express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const todos = require('./routes/todo');
const user = require('./routes/user');
const expressSession = require('express-session');
const passport 	  = require('passport');
const cookieParser = require('cookie-parser');

mongoose.connect('mongodb://localhost:27017/mongoose_express_todos', {
    // useMongoClient: true
    useNewUrlParser: true
}).then(function () {
    console.log('Database connected');
});

const app = express();
// app.use(bodyParser.urlencoded({ extented: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cookieParser());

// app.use(cookieParser);
app.use(expressSession({ 
	secret: 'secret-key',
	resave: false,
	saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

const mustacheExpressInstance = mustacheExpress();
mustacheExpressInstance.cache = null;

app.engine('mustache', mustacheExpressInstance);
app.set('view engine', 'mustache');
app.set('views', __dirname + '/views');

app.use('/todos', todos);
app.use('/', user);

app.listen(1234, function () {
    console.log('Listening on port 3000');
});