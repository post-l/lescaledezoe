var auth = require('../utils/authorization');
var User = require('../models/user');

module.exports = function(app, passport, config) {

    /**
     * GET routes
     */

    app.get('/', function(req, res) {
        if (req.isAuthenticated()) {
            res.render('index', {
                title: config.app.name,
                user: req.user
            });
        } else {
            res.render('index', {
                title: config.app.name,
                user: null
            });
        }});

    app.get('/auth/facebook', passport.authenticate('facebook', {scope: 'email'}));

    app.get('/auth/facebook/callback', passport.authenticate('facebook', {failureRedirect: '/login'}),
            function(req,res) {
                res.render('profile', {user : req.user});
            });

    app.get('/auth/google',
            passport.authenticate('google', {
                scope: [
                    'https://www.googleapis.com/auth/userinfo.profile',
                    'https://www.googleapis.com/auth/userinfo.email'
                ]}));

    app.get('/auth/google/callback',
            passport.authenticate('google', {failureRedirect: '/login'}),
            function(req, res) {
                res.redirect('/');
            });


    app.get('/login', function(req, res) {
        if (req.isAuthenticated()) {
            res.redirect('/');
        } else {
            res.render('login', {
                title: config.app.name,
                user: null,
                email: req.email
            });
        }});

    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    app.get('/signup', function(req, res) {
        if (req.isAuthenticated()) {
            res.redirect('/');
        } else {
            res.render('signup', {
                title: config.app.name,
                user: null,
                email: req.email
            });
        }});

    app.get('/profile', auth.isAuthenticated, function(req, res) {
        res.send('Yeah you are ' + req.user);
    });

    app.get('/buy', auth.isAuthenticated, function(req, res) {
        res.send('buy page ' + req.user);
    });

    /**
     * POST routes
     */

    app.post('/login', passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/login'
    }));

    app.post('/signup', auth.userExist, function(req, res, next) {
        User.signup(req.body.email, req.body.password, function(err, user) {
            if (err) throw err;
            req.login(user, function(err) {
                if (err) return next(err);
                return res.redirect('/');
            });
        });
    });
};
