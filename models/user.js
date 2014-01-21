var mongoose = require('mongoose');
var hash = require('../utils/hash');

var UserSchema = mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    salt: String,
    hash: String,
    facebook: {
        id: String,
        email: String,
        name: String
    },
    google: {
        id: String,
        email: String,
        name: String
    }
});

UserSchema.statics.signup = function(email, password, done) {
    var User = this;
    hash(password, function(err, salt, hash) {
        if (err) throw err;
        // if (err) return done(err);
        User.create({
            email: email,
            salt: salt,
            hash: hash
        }, function(err, user) {
            if(err) throw err;
            // if (err) return done(err);
            done(null, user);
        });
    });
};


UserSchema.statics.isValidUserPassword = function(email, password, done) {
    this.findOne({email: email}, function(err, user) {
        // if (err) throw err;
        if (err) return done(err);
        if (!user) return done(null, false, {message: 'Incorrect email.'});
        hash(password, user.salt, function(err, hash) {
            if (err) return done(err);
            if (hash == user.hash) return done(null, user);
            done(null, false, {message : 'Incorrect password'});
        });
    });
};

UserSchema.statics.findOrCreateOAuthUser = function(profile, done) {
    var User = this;
    var query = {};
    query[profile.authOrigin + '.id'] = profile.id;
    User.findOne(query, function(err, user) {
        if (err) throw err;
        if (user) {
            done(null, user);
        } else {
            User.findOne({ 'email' : profile.emails[0].value }, function(err, user){
                if (err) throw err;
                if (user) {
                    user[''+profile.authOrigin] = {};
                    user[''+profile.authOrigin].id = profile.id;
                    user[''+profile.authOrigin].email = profile.emails[0].value;
                    user[''+profile.authOrigin].name = profile.displayName;
                    user.save(function(err, user) {
                        if (err) throw err;
                        done(null, user);
                    });
                } else {
                    user = {
                        email : profile.emails[0].value,
                        firstName : profile.displayName.split(" ")[0],
                        lastName : profile.displayName.replace(profile.displayName.split(" ")[0] + " ", "")
                    };
                    user[''+profile.authOrigin] = {};
                    user[''+profile.authOrigin].id = profile.id;
                    user[''+profile.authOrigin].email = profile.emails[0].value;
                    user[''+profile.authOrigin].name = profile.displayName;
                    User.create(user, function(err, user) {
                        if (err) throw err;
                        done(null, user);
                    });
                }});
        }});
};

var User = mongoose.model("User", UserSchema);
module.exports = User;
