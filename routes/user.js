const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');
const passport = require('passport');
const passportLocal = require('passport-local');
const User = require('../models/user');

passport.use(new passportLocal.Strategy(function (username, password, done) {
    User.findOne({ username: username }, function (err, user) {
        console.log(user);
        if (err) { return done(err); }
        if (!user) {
            return done(null, false, { message: 'Incorrect username.' });
        }
        if (user.password != password) {
            return done(null, false, { message: 'Incorrect password.' });
        }
        return done(null, user);
    });
}));

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    });
});

router.get('/login', function (req, res) {
    if (req.isAuthenticated()) {
        res.redirect('/');
    }

    res.render('login', { message: req.session.message });
});


router.get('/logout', function(){
    req.logout();
    req.session.message = "";
    res.redirect("/login");
});

router.get('/signup', function(req, res){
    if(req.isAuthenticated()){
        res.redirect("/");
    }

    res.render('signup');
});

router.post('/signup', function(req, res){
    new User({ username: req.body.username, password: req.body.password }).save(function (err, doc) {
        if (err) res.json(err);
        else res.render('signup', {message: "Registration successful!"});
      });
});

module.exports = router;