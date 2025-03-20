const { CreatedResponse, OkResponse } = require("../core/success.response")
const taskService = require("../services/task.service")
const HEADER = {
    CLIENT_ID: 'x-client-id',
};
class TaskController {
    userId = null;
    setUserId(req) {
        this.userId = req.headers[HEADER.CLIENT_ID];
    }
    createTask = async (req, res, next) => {
        this.setUserId(req);
        new CreatedResponse({
            message: 'create task success',
            metadata: await taskService.createTask(req.body, this.userId),
            options: {
                limit: 10
            }
        }).send(res)
    }
    updateTaskStatus = async (req, res, next) => {
        this.setUserId(req);
        new CreatedResponse({
            message: 'update task success',
            metadata: await taskService.updateTaskStatus(req.body, this.userId),
        }).send(res)
    }
    getTaskStatistics = async (req, res, next) => {
        const projectId = req.query.projectId;
        new OkResponse({
            message: 'get task statistics success',
            metadata: await taskService.getProjectStatistics(projectId),
        }).send(res)
    }

}

module.exports = new TaskController();