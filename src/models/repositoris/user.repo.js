'use strict'

const { User } = require("../../models")

const findByUserName = async ({ username }) => {
    // Specify the attributes you want to retrieve
    const attributes = ['id', 'username', 'email', 'password', 'total_projects',
        'total_tasks_completed', 'total_tasks_incompleted'];
    // Use the attributes in the findOne query
    return await User.findOne({
        where: { username: username },
        attributes: attributes, // Only select the specified attributes
    });
}
const findById = async ({ userId }) => {
    // Specify the attributes you want to retrieve
    const attributes = ['id', 'username',];
    // Use the attributes in the findOne query
    return await User.findOne({
        where: { id: userId },
        attributes: attributes, // Only select the specified attributes
    });
};

module.exports = {
    findByUserName,
    findById
}