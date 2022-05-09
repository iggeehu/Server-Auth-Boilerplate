const User = require('../models/user')
const jwt = require('jwt-simple')
const config = require('../config')

function tokenForUser(user){
    
    return jwt.encode({sub: user.id}, config.secret)
}

exports.signup = function(req, res, next)
{
    //see if a user with the given email exists
    const email = req.body.email;
    const password=req.body.password;
    
    if(!email||!password){
        return res.status(422).send({
            error: 'You must provide email and password'
        })
    }
    
    User.findOne({email:email}, function(err, existingUser){
        if(err){return next(err)}

        //if it does exist, return error
        if(existingUser){
            return res.status(422).send({error: 'email is in use'})
        }
        //if a user with email does not exist in db, create and save user record
        const user = new User({
            email: email,
            password:password
        })

        user.save((err)=>
        {if(err) {return next(err)}
        res.json({token:tokenForUser(user)})
      
        })})}

exports.signin = function(req, res, next){
    console.log(req.user)
res.send({token:tokenForUser(req.user)})



}