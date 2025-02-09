
/**
 * @swagger
 * tags:
 *   name: Shop
 *   description: APIs related to shop operations
 */
const express = require('express');
const router = express.Router();
const { asyncHandle } = require('../../auth/checkAuth');
const usersController = require('../../controllers/users.controller');

router.post('/create', asyncHandle(usersController.createUser));
router.post('/login', asyncHandle(usersController.login));


module.exports = router;
