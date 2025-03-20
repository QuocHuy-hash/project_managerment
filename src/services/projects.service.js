'use strict'

const { BadRequestError, AuthFailureError } = require("../core/error.response");
const { Project, Task, User, TaskAssignment } = require('../models');
const { findProjectById } = require("../models/repositoris/projects.repo");
const { UserFindById } = require("../models/repositoris/user.repo");

const createProject = async (project) => {
    const { name, description, owner_id, start_date, end_date } = project;
    if (!name || !owner_id) {
        throw new BadRequestError('Name and owner_id are required');
    }
    const existingProject = await Project.findOne({ where: { name } });
    if (existingProject) {
        throw new BadRequestError('A project with the same name already exists');
    }
    // Check if the project owner exists

    const owner = await UserFindById({ userId: owner_id });
    if (!owner) {
        throw new AuthFailureError('Invalid owner_id');
    }

    const projectData = {
        name,
        description,
        owner_id,
        start_date,
        end_date
    };
    return await Project.create(projectData);
}
const updateProject = async (body) => {
    const { id, name, description, owner_id, start_date, end_date } = body;
    if (!id) {
        throw new BadRequestError('id is required');
    }
    const existingProject = findProjectById({ id });
    if (!existingProject) {
        throw new BadRequestError('Invalid project id');
    }
    const projectData = {
        name,
        description,
        owner_id,
        start_date,
        end_date
    };
    return await Project.update(projectData, { where: { id } });
}

const getProjectListAll = async () => {
    return await Project.findAll();
}
const getProjectMembers = async (projectId) => {
    // Kiểm tra xem project có tồn tại không
    const project = await Project.findByPk(projectId);
    if (!project) {
        throw new Error('Project not found');
    }

    // Lấy tất cả các task thuộc project và kèm theo thông tin người được giao task
    const tasks = await Task.findAll({
        where: { project_id: projectId },
        include: [
            {
                model: User,
                as: 'Assignees',
                through: {
                    model: TaskAssignment,
                    attributes: []
                },
                attributes: ['id', 'username', 'email', 'role']
            }
        ]
    });
    console.log("tasks", tasks);
    // Tạo một Set để loại bỏ các user trùng lặp
    const members = new Set();
    tasks.forEach(task => {
        if (task.Assignees && task.Assignees.length > 0) {
            task.Assignees.forEach(user => {
                members.add(JSON.stringify(user)); // Sử dụng JSON.stringify để thêm object vào Set
            });
        }
    });

    return Array.from(members).map(user => JSON.parse(user));
};
module.exports = {
    createProject,
    updateProject,
    getProjectListAll,
    getProjectMembers
}