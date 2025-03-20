'use strict'

const { User } = require("../../models")

const findByUserName = async ({ username }) => {
    // Specify the attributes you want to retrieve
    const attributes = ['id', 'username', 'email', 'password', 'total_projects'];
    // Use the attributes in the findOne query
    return await User.findOne({
        where: { username: username },
        attributes: attributes, // Only select the specified attributes
    });
}
const UserFindById = async ({ userId }) => {
    console.log("UserFindById", userId)
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
    UserFindById
}