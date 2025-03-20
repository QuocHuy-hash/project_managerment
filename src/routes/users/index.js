
const express = require('express');
const router = express.Router();
const { asyncHandle } = require('../../auth/checkAuth');
const usersController = require('../../controllers/users.controller');

router.post('/create', asyncHandle(usersController.createUser));
router.post('/login', asyncHandle(usersController.login));
router.get('/list-all', asyncHandle(usersController.listUser));


module.exports = router;
