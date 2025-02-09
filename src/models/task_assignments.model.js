'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class TaskAssignment extends Model {
        static associate(models) {
            TaskAssignment.belongsTo(models.Task, { foreignKey: 'task_id' });
            TaskAssignment.belongsTo(models.User, { foreignKey: 'user_id' });
        }
    }

    TaskAssignment.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        task_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        assigned_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }
    }, {
        sequelize,
        modelName: 'TaskAssignment',
        timestamps: false
    });

    return TaskAssignment;
};
