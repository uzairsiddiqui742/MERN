const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt')
const User = require("./models/User");
const passport = require("passport");
require('dotenv').config();
const port = 3000
// jsonwebtoken: This package creates a token used for authorization for secure communication between client and server.
// body-parser: It is used to parse incoming request bodies in a middleware
// cors: CORS is a node.js package for providing a Connect/Express middleware that can be used to enable CORS with various options.
// brcypt: A library to hash passwords.

//import routes
const authRoutes = require('./routes/auth');
const { db } = require('./models/User');

//app
const app = express();

//db
url ="mongodb+srv://uzairsiddiqui:Uzzi74334784@cluster0.ouir1.mongodb.net/?retryWrites=true&w=majority"
mongoose.connect(url,
    {
        useNewURlParser : true,
        useUnifiedTopology : true
    }).then(console.log("mongodb connected")).catch(err => console.log(err)
    )


 //middlewares
const urlParsor = bodyParser.urlencoded({extended: false})
app.use(bodyParser.json(),urlParsor);
// app.use(bodyParser.urlencoded({ extended: true }))
// app.use(cors());

// Passport middleware
app.use(passport.initialize());

// Passport config
require("./utils/passport")(passport);

//routes middleware
app.use('/api', authRoutes);


app.listen(port,()=>{
    console.log(`Server is running at port ${port}`)
})