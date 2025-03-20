'use strict'

const { BadRequestError, AuthFailureError } = require("../core/error.response");
const { ProjectPhase } = require('../models');
const { findProjectById } = require("../models/repositoris/projects.repo");

const createProjectPhases = async (projectPhases) => {
    const { project_id, name, description, start_date, end_date } = projectPhases;
    if (!name || !project_id) {
        throw new BadRequestError('Name and project_id are required');
    }
    const existingProject = await findProjectById({ id: project_id });
    if (!existingProject) { throw new BadRequestError('Invalid project_id'); }

    const existingProjectPhases = await ProjectPhase.findOne({ where: { project_id, name } });
    if (existingProjectPhases) {
        throw new BadRequestError('A project phases with the same name already exists');
    }

    const projectData = {
        project_id,
        name,
        description,
        start_date,
        end_date
    };
    return await ProjectPhase.create(projectData);
}
const getProjectPhases = async (project_id) => {
    if (!project_id) { throw new BadRequestError('project_id is required'); }
    return await ProjectPhase.findAll({ where: { project_id } });
}
const delProjectPhases = async (body) => {
    const { project_id, project_phases_id } = body;
    if (!project_id || !project_phases_id) { throw new BadRequestError('project_id is required'); }
    return await ProjectPhase.destroy({ where: { id: project_phases_id, project_id, } });
}

module.exports = {
    createProjectPhases, getProjectPhases, delProjectPhases
}