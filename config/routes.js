var auth = require('../utils/authorization');
var User = require('../models/user');
var Madmimi = require('../utils/madmimi');
var Nodemailer = require('nodemailer');
var passport = require('passport');
var paypal_api = require('paypal-rest-sdk');

module.exports = function(app, config) {

    var smtpTransport = Nodemailer.createTransport("SMTP", {
        service: "Gmail",
        auth: config.gmailAuth
    });

    var create_payment_json = {
        "intent": "sale",
        "payer": {
            "payment_method": "paypal"
        },
        "redirect_urls": {
            "return_url": "http://lescaledezoe.com/payments?success=true",
            "cancel_url": "http://lescaledezoe.com/payments?success=false"
        },
        "transactions": [{
            "amount": {
                "currency": "EUR",
                "total": "29.00"
            },
            "description": "Coffret Iran par l'Escale de Zoe"
        }]
    };

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
                res.redirect('/');
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
        res.render('profile', {
            title: config.app.name,
            user: req.user
        });
    });

    app.get('/order', auth.isAuthenticated, function(req, res) {
        paypal_api.payment.create(create_payment_json, config.paypal, function (err, resPaypal) {
            if (err) {
                console.log("Payment Error: " + err);
                res.send(500, err);
            }
            if (resPaypal) {
                for (var link in resPaypal.links) {
                    if (resPaypal.links[link].method == "REDIRECT") {
                        res.redirect(resPaypal.links[link].href);
                    }
                }
            } else {
                res.send(500);
            }
        });
    });

    app.get('/payments', auth.isAuthenticated, function(req, res) {
        res.render('payments', {
            title: config.app.name,
            user: req.user,
            success: req.body.success
        });
    });

    app.get('/precommande', function(req, res) {
        res.render('precommande', {
            title: config.app.name,
            user: req.user
        });
    });

    app.get('/contact', function(req, res) {
        res.render('contact', {
            title: config.app.name,
            user: req.user
        });
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

    app.post('/newsletter', function(req, res) {
        var madmimi = new Madmimi(config.madmimi);
        madmimi.addToList(req.body.email, 'users');
        res.redirect('/');
    });

    app.post('/contact', function(req, res) {
        var mailOptions = {
            from: req.body.name + ' <' + req.body.email + '>',
            to: 'lescaledezoe@gmail.com',
            subject: req.body.subject + ' ' + req.body.name + ' <' + req.body.email + '>',
            text: req.body.message,
            html: req.body.message
        };
        smtpTransport.sendMail(mailOptions, function(error, response){
            if (error) {
                console.log(error);
                res.send(500);
            } else {
                console.log("Message sent: " + response.message);
                res.send(200);
            }
        });
    });
};
