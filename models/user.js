const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt')

const userSchema = new Schema({
    email: {type: String, unique: true, lowercase: true},
    password: String
})

//On save hook, encrypt password
userSchema.pre('save', function(next){
    const user = this;
    console.log(this)
    bcrypt.genSalt(10, function(err, salt){
        if(err){return next(err)}
        bcrypt.hash(user.password, salt, function(err, hash){
            if(err){return next(err)}
            user.password = hash;
            next();
        })
    })
})

userSchema.methods.comparePassword = function(candidatePassword, cb){
    bcrypt.compare(candidatePassword, this.password, function(err, ismatch){
        if (err) {return err};
        cb(err, ismatch);
    })
}


const ModelClass = mongoose.model('User', userSchema)

module.exports = ModelClass