
const express = require('express');
const router = express.Router();
const { asyncHandle } = require('../../auth/checkAuth');
const ProjectPhasesController = require('../../controllers/projects.phases.controller');

router.post('/create', asyncHandle(ProjectPhasesController.createProjectPhases));
router.post('/delete', asyncHandle(ProjectPhasesController.delProjectPhases));
router.get('/list', asyncHandle(ProjectPhasesController.getProjectPhases));

module.exports = router;
