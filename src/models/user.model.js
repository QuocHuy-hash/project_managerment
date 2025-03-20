'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        static associate(models) {
            User.hasMany(models.Project, {
                foreignKey: 'owner_id',
                as: 'ownedProjects'
            });
            User.hasMany(models.Task, {
                foreignKey: 'assigned_to',
                as: 'assignedTasks'
            });
            User.hasMany(models.TaskComment, {
                foreignKey: 'user_id'
            });
            User.hasMany(models.TaskDiscussion, {
                foreignKey: 'user_id'
            });
            User.hasMany(models.UserPerformance, {
                foreignKey: 'user_id'
            });
            User.belongsToMany(models.Task, {
                through: models.TaskAssignment,
                foreignKey: 'user_id',
                as: 'AssignedTasks'
            });
        }
    }

    User.init({
        username: {
            type: DataTypes.STRING(50),
            allowNull: false,
            unique: true,
            validate: {
                len: [3, 50]
            }
        },
        name: {
            type: DataTypes.STRING(50),
            allowNull: true,
            validate: {
                len: [3, 50]
            }
        },
        email: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true
            }
        },
        password: {
            type: DataTypes.STRING(255),
            allowNull: false,
            validate: {
                len: [6, 255]
            }
        },
        role: {
            type: DataTypes.ENUM('Owner', 'Project Manager', 'Frontend Dev', 'Backend Dev', 'Tester'),
            allowNull: false,
            defaultValue: 'Frontend Dev'
        },
        total_projects: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        performance_score: {
            type: DataTypes.FLOAT,
            defaultValue: 0
        },
        average_rating: {
            type: DataTypes.FLOAT,
            defaultValue: 0
        }
    }, {
        sequelize,
        modelName: 'User',
        tableName: 'Users',
        timestamps: true,
    });

    return User;
};
