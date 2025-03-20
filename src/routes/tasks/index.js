

const express = require('express');
const router = express.Router();
const { asyncHandle } = require('../../auth/checkAuth');
const TaskController = require('../../controllers/task.controller');

router.post('/create', asyncHandle(TaskController.createTask));
router.post('/update-status', asyncHandle(TaskController.updateTaskStatus));
router.get('/get-statistics', asyncHandle(TaskController.getTaskStatistics));

module.exports = router;
