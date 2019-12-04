const express = require('express');
const router = express.Router();
const {
  signup,
  signin,
  signout,
  requireSignin,
  userById,
  isAuth
} = require('../controllers/user-controllers');

router.post('/signup', signup);
router.post('/signin', signin);
router.get('/signout', signout);
router.get('/users/:userId', requireSignin, isAuth, (req, res) => { // Test in Insomnia
  res.json({
    user: req.profile
  })
});

router.param('userId', userById)

module.exports = router;
