const User = require('../models/user-document-models');

exports.signup = (req, res) => {
  console.log('req.body', req.body);

  const newUser = new User(req.body);

  newUser.save((err, user) => {
    if(err) {
      return res.status(400).json({
        err
      })
    } else {
      res.json({
        user
      })
    }
  })
};
