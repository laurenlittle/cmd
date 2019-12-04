const { User } = require('../models/user-document-models');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');

exports.signup = (req, res) => {
  console.log('req.body', req.body);

  const newUser = new User(req.body);

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

    // persist the token as 'tkn' in cookie
    res.cookie('tkn', token, {
      expire: new Date() + 9999
    });

    // return response with user and token to FE client
    const {_id, name, email} = user;
    return res.json({token, user: { _id, name, email}});

  })
};


exports.signout = (req, res) => {
  res.clearCookie('tkn');
  res.json({
    message: 'Signout was successful'
  })
};


exports.requireSignin = expressJwt({
  secret: process.env.JWT_SECRET,
  requestProperty: 'auth'
});

exports.userById = (req, res, next, id) => {

 User.findById(id).exec((err, user) => {

  if (err || !user) {
    return res.status(400).json({
      error: 'User not found'
     })
   }

   // add user to request object as profile
   req.profile = user;

   next();

 });
};


exports.isAuth = (req, res, next) => {
  //  logged in user and autheticated user must have same ID
  let user = req.profile && req.auth && req.profile._id == req.auth.id

  if (!user) {
    return res.status(403).json({
      error: 'Access Denied Pal.'
    });
  }

  next();

};