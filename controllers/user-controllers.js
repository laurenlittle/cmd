const { User } = require('../models/user-document-models');
const jwt = require('json-web-token');
const expressJwt = require('express-jwt');

exports.signup = (req, res) => {
  console.log('req.body', req.body);

  const newUser = new User(req.body); // complaining here - 

  newUser.save((err, user) => {
    if(err) {
      return res.status(400).json({
        error: err
      })
    }

    newUser.salt = undefined;
    newUser.hashed_password = undefined;

    res.json({
      user
    })
  })
};


exports.signin = (req, res) => {
  const { email, password } = req.body;

  User.findOne({email}, (err, user) => {
    if(err || !user) {
      return res.status(400).json({
        error: `User with that email doesn't exist, please sign up.`
      });
    }

    if(!user.authenticate(password)) {
      return res.status(401).json({
        error: `Email and password do not match, please try again.`
      });
    }

    // generate signed token
    const token = jwt.sign({
      id: user._id
    }, process.env.JWT_SECRET);

      // persist the token as 't' in cookie
    res.cookie('t', token, {
      expire: new Date() + 9999
    });

    // return response with user and token to FE client
    const {_id, name, email} = user;
    return res.json({token, user: { _id, name, email}});

  })
};
