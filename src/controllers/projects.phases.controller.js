'use strict'

const { CreatedResponse, SuccessResponse, OkResponse } = require("../core/success.response");
const { createProjectPhases, getProjectPhases, delProjectPhases } = require("../services/projects.phases.service");
const HEADER = {
    CLIENT_ID: 'x-client-id',
};
class ProjectPhasesController {
    createProjectPhases = async (req, res, next) => {
        new CreatedResponse({
            message: 'create project phases success',
            metadata: await createProjectPhases(req.body),
            options: {
                limit: 10
            }
        }).send(res)
    };
    getProjectPhases = async (req, res, next) => {
        new SuccessResponse({
            message: 'getProjectPhases Success',
            metadata: await getProjectPhases(req.query.project_id),
        }).send(res)
    }
    delProjectPhases = async (req, res, next) => {
        new OkResponse({
            message: 'delete Project Phases Success',
            metadata: await delProjectPhases(req.body),
        }).send(res)
    }
}

module.exports = new ProjectPhasesController();