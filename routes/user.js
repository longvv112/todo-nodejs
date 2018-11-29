const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');
const passport = require('passport');
const passportLocal = require('passport-local');
const User = require('../models/user');
const bcrypt = require('bcryptjs');

passport.use(new passportLocal.Strategy(function (username, password, done) {
    User.findOne({ username: username }, function (err, user) {
        if (err) { return done(err); }
        if (!user) {
            return done(null, false, { message: 'Incorrect username.' });
        }

        if (!bcrypt.compareSync(password, user.password)) {
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
        res.redirect('/todos');
    }

    res.render('login', { message: req.session.message });
});

router.post('/login', loginPost);

function loginPost(req, res, next) {
    passport.authenticate('local', function (err, user, info) {
        console.log(user);
        if (err) {
            return next(err);
        }

        if (!user) {
            req.session.messages = info.message;
            return res.redirect('/login');
        }


        req.logIn(user, function (err) {
            if (err) {
                req.session.messages = "Error";
                return next(err);
            }

            // set the message
            return res.redirect('/todos');
        });

    })(req, res, next);
}

// router.post('/login', function(req, res, next){


//     if(req.body.username && req.body.password){
//         User.authenticate(req.body.username, req.body.password, function (error, user) {
//             if (error || !user) {
//               var err = new Error('Wrong email or password.');
//               err.status = 401;
//               return next(err);
//             } else {
//               req.session.userId = user._id;
//               return res.redirect('/');
//             }
//           });

//     }else{
//         let err = new Error('All fields required.');
//         err.status = 400;
//         return next(err);
//     }
// });


router.get('/logout', function (req, res) {
    req.logout();
    req.session.message = "";
    res.redirect("/login");
});

router.get('/signup', function (req, res) {
    if (req.isAuthenticated()) {
        res.redirect("/");
    }

    res.render('signup');
});

router.post('/signup', function (req, res) {
    if (req.body.password !== req.body.passwordConf) {
        var err = new Error('Passwords do not match.');
        err.status = 400;
        res.send("Passwords don't match");
        return next(err);
    }

    if (req.body.username && req.body.password && req.body.passwordConf) {
        let userData = {
            username: req.body.username,
            password: req.body.password,
            passwordConf: req.body.passwordConf,
        }

        User.create(userData, function (error, user) {
            if (error) {
                return next(error);
            } else {
                req.session.userId = user._id;
                return res.redirect('/login');
            }
        });
    } else {
        let err = new Error('All fields required.');
        err.status = 400;
        // return next(err);
    }

    // if (req.body.username && req.body.password)
    //     new User({ username: req.body.username, password: req.body.password }).save(function (err, doc) {
    //         if (err) res.json(err);
    //         else res.render('signup', { message: "Registration successful!" });
    //     });
});

module.exports = router;