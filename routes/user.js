const express = require('express');
const router = express.Router();
const {
  sayHi
} = require('../controllers/user');


/* GET users listing. */
router.get('/', sayHi);

module.exports = router;
