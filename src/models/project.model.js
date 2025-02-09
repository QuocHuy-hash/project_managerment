'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Project extends Model {
        static associate(models) {
            Project.belongsTo(models.User, {
                foreignKey: 'owner_id',
                as: 'owner'
            });
            Project.hasMany(models.ProjectPhase, {
                foreignKey: 'project_id',
                as: 'phases'
            });
            Project.hasMany(models.Task, {
                foreignKey: 'project_id',
                as: 'tasks'
            });
            Project.hasMany(models.UserPerformance, {
                foreignKey: 'project_id'
            });
        }
    }

    Project.init({
        name: {
            type: DataTypes.STRING(100),
            allowNull: false,
            validate: {
                len: [1, 100]
            }
        },
        description: DataTypes.TEXT,
        owner_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        start_date: DataTypes.DATE,
        end_date: DataTypes.DATE,
        status: {
            type: DataTypes.ENUM('Planning', 'In Progress', 'On Hold', 'Completed', 'Cancelled'),
            defaultValue: 'Planning'
        },
        total_tasks: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        completed_tasks: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        progress_rate: {
            type: DataTypes.FLOAT,
            defaultValue: 0
        }
    }, {
        sequelize,
        modelName: 'Project',
        tableName: 'Projects',
        underscored: true,
        hooks: {
            afterCreate: async (project, options) => {
                // Update user's total_projects
                const User = sequelize.models.User;
                await User.increment('total_projects', {
                    where: { id: project.owner_id }
                });
            }
        }
    });

    return Project;
};