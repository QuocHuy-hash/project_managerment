'use strict'

const { CreatedResponse, SuccessResponse, OkResponse } = require("../core/success.response");
const { createProject, updateProject, getProjectListAll, getProjectMembers } = require("../services/projects.service");
const HEADER = {
    CLIENT_ID: 'x-client-id',
};
class ProjectController {
    userId = null;
    setUserId(req) {
        this.userId = req.headers[HEADER.CLIENT_ID];
    }
    createProject = async (req, res, next) => {
        this.setUserId(req);
        new CreatedResponse({
            message: 'create project success',
            metadata: await createProject(req.body, this.userId),
            options: {
                limit: 10
            }
        }).send(res)
    }
    updateProject = async (req, res, next) => {
        new OkResponse({
            message: 'update project success',
            metadata: await updateProject(req.body),
        }).send(res)
    }
    getListAll = async (req, res, next) => {
        new SuccessResponse({
            message: 'get all project success',
            metadata: await getProjectListAll(),
        }).send(res)
    }
    getProjectMembers = async (req, res) => {
        const { projectId } = req.query;
        new SuccessResponse({
            message: 'get project members success',
            metadata: await getProjectMembers(projectId),
        }).send(res)
    }
}

module.exports = new ProjectController();