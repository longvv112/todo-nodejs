const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

let userSchema = new Schema({
    username: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

userSchema.statics.authenticate = function(username, password, callback){
    User.findOne({username: username}).exec(function(err,user){
        if(err){
            return callback(err);
        }else if(!user){
            let err = new Error('User not found.');
            err.status = 401;
            return callback(err);
        }

        bcrypt.compare(password, user.password, function(err, result){
            if(result === true){
                return callback(null, user);
            }else{
                return callback();
            }
        })
    });
}


userSchema.pre('save', function (next) {
    let user = this;
    bcrypt.hash(user.password, 10, function (err, hash) {
        if (err) {
            return next(err);
        }

        user.password = hash;
        next();
    });
});

var User = mongoose.model('User', userSchema)

module.exports = User;