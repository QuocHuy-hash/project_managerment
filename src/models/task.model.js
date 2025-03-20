'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {

    class Task extends Model {

        static associate(models) {

            Task.belongsTo(models.Project, { foreignKey: 'project_id' });
            Task.belongsTo(models.ProjectPhase, { foreignKey: 'phase_id' });
            Task.belongsTo(models.Task, { as: 'ParentTask', foreignKey: 'parent_task_id' });
            Task.belongsTo(models.User, { foreignKey: 'assigned_to' });
            Task.hasMany(models.Task, { as: 'SubTasks', foreignKey: 'parent_task_id' });
            Task.hasMany(models.TaskComment, { foreignKey: 'task_id' });
            Task.hasMany(models.TaskDiscussion, { foreignKey: 'task_id' });
            Task.hasMany(models.TaskStatusHistory, { foreignKey: 'task_id' });
            Task.belongsToMany(models.User, {
                through: models.TaskAssignment,
                foreignKey: 'task_id',
                as: 'Assignees'
            });
        }

    }

    Task.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        title: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        description: DataTypes.TEXT,
        project_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        phase_id: DataTypes.INTEGER,
        parent_task_id: DataTypes.INTEGER,
        assigned_to: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        start_date: DataTypes.DATE,
        deadline: DataTypes.DATE,
        actual_completion_date: DataTypes.DATE,
        estimated_hours: DataTypes.FLOAT,
        actual_hours: DataTypes.FLOAT,
        status: {
            type: DataTypes.ENUM('To Do', 'In Progress', 'Ready for Test', 'Has Bug', 'Tested', 'Released'),
            defaultValue: 'To Do'
        },
        priority: {
            type: DataTypes.ENUM('Low', 'Medium', 'High', 'Urgent'),
            defaultValue: 'Medium'
        },
        completion_rate: {
            type: DataTypes.FLOAT,
            defaultValue: 0
        },
    }, {
        sequelize,
        modelName: 'Task',

    });

    return Task;
}; 