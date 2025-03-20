const { Project } = require('../../models');

const findProjectById = async ({ id }) => {
    return await Project.findByPk(id);
}

module.exports = {
    findProjectById,
}