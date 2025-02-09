

const express = require('express');

const router = express.Router();

// user
router.use('/v1/api/user', require('./users/index'));


module.exports = router;