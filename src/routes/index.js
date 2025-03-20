

const express = require('express');
const { authentication } = require('../auth/authUtil');

const router = express.Router();

// user
router.use('/v1/api/user', require('./users/index'));
router.use(authentication);
router.use('/v1/api/project', require('./projects/index'));
router.use('/v1/api/project-phases', require('./projectsPhases/index'));
router.use('/v1/api/task', require('./tasks/index'));


module.exports = router;