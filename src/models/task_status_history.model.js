'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class TaskStatusHistory extends Model {
        static associate(models) {
            TaskStatusHistory.belongsTo(models.Task, { foreignKey: 'task_id' });
            TaskStatusHistory.belongsTo(models.User, { foreignKey: 'changed_by' });
        }
    }

    TaskStatusHistory.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        task_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        old_status: {
            type: DataTypes.ENUM('To Do', 'In Progress', 'Ready for Test', 'Has Bug', 'Tested', 'Released')
        },
        new_status: {
            type: DataTypes.ENUM('To Do', 'In Progress', 'Ready for Test', 'Has Bug', 'Tested', 'Released'),
            allowNull: false
        },
        changed_by: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        comment: DataTypes.TEXT,
        change_date: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }
    }, {
        sequelize,
        modelName: 'TaskStatusHistory',
        timestamps: false
    });

    return TaskStatusHistory;
}; 