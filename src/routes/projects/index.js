
const express = require('express');
const router = express.Router();
const { asyncHandle } = require('../../auth/checkAuth');
const ProjectController = require('../../controllers/projects.controller');

router.post('/create', asyncHandle(ProjectController.createProject));
router.post('/update', asyncHandle(ProjectController.updateProject));
router.get('/list-all', asyncHandle(ProjectController.getListAll));
router.get('/members', asyncHandle(ProjectController.getProjectMembers));

module.exports = router;
