const { User } = require('../models/user-document-models');

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
