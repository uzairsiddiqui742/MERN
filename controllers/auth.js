const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const { createJWT } = require("../utils/auth");

const emailRegexp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
exports.signup = (req, res)=>{

    //person name, email, password, and password confirmation
    let { name, email, password, password_confirmation } = req.body;
    let errors = [];
    if (!name) {    //if name is null => example: "name": "" then raise required error. same for other attributes
        errors.push({ name: "required" });
    }
    if (!email) {
        errors.push({ email: "required" });
    }
    if (!emailRegexp.test(email)) {  // if email format is not correct i.e not including @ or .com etc
        errors.push({ email: "invalid" });
    }
    if (!password) {
        errors.push({ password: "required" });
    }
    if (!password_confirmation) {
        errors.push({
            password_confirmation: "required",
        });
    }
    if (password != password_confirmation) {   // if password and confirm password doesnot match
        errors.push({ password: "mismatch" });
    }
    if (errors.length > 0) {    // if there is any error encounter yet, then show it
        return res.status(422).json({ errors: errors });
    }
    User.findOne({email: email}).then(user =>{ //find email in mongodb database
        if(user)
        {   //if email is found, then email already exists. return.
            return res.status(404).json({errors: [{ user: "email already exists" }]});
        }
        else
        {   // else create a new user with given attributes
            const user = new User({name: name, email: email, password: password });
            //bcrypt is used to hash the user password. 10 represent 10 time it will be hashed 
            bcrypt.genSalt(10, (err, salt)=>{
                bcrypt.hash(password, salt, (err, hash)=>{
                    if (err) throw err;
                    user.password = hash;
                    user.save().then(response =>{  //save user in mongodb database
                        res.status(200).json({
                            success: true,
                            result: response
                        })
                    }).catch(err =>{
                        res.status(500).json({errors: [{ error: err }]});
                    })
                })
            })
        }
    }).catch(err =>{
        res.status(500).json({errors: [{ error: 'Something went wrong' }]});
    })
}

exports.signin = (req, res)=>{
    let { email, password } = req.body;  //to signin 
    let errors = [];
    if(!email)
    {
        errors.push({ email: "required" });
    }
    if(!emailRegexp.test(email))
    {
        errors.push({ email: "invalid email" });
    }
    if(!password)
    {
        errors.push({ passowrd: "required" });
    }
    if (errors.length > 0)
    {
        return res.status(422).json({ errors: errors });
    }
    User.findOne({email: email}).then(user =>{
        if(!user)
        {   // if user not found in database, return
            return res.status(404).json({errors: [{ user: "not found" }]});
        }
        else
        {
            //compare password, if match then generate token
            bcrypt.compare(password, user.password).then(isMatch =>{
                if(!isMatch)
                {
                    return res.status(400).json({ errors: [{ password:"incorrect" }]});
                }
                //sign token 
                let access_token = createJWT( user.email, user._id);
                //verify token with same key given in sign. here "secret" is key. should definetly be change in production
                jwt.verify(access_token, "secret", (err,decoded) =>{
                    if(err)
                    {
                        res.status(500).json({ errors: err });
                    }
                    if(decoded)
                    {   //if key is decoded, then sign in
                        return res.status(200).json({
                            success: true,
                            token: access_token,
                            message: user
                        });
                    }
                });
                
                // jwt.sign(payload, "secret",{expiresIn: 3600},(err, token)=>{
                //     res.json({
                //         success: true,
                //         token: "Bearer "+ token
                //     });
                // })

            })
        }
    }).catch(err =>{
        res.status(500).json({ erros: err });
    })
}