'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class TaskComment extends Model {
        static associate(models) {
            TaskComment.belongsTo(models.Task, { foreignKey: 'task_id' });
            TaskComment.belongsTo(models.User, { foreignKey: 'user_id' });
        }
    }

    TaskComment.init({
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
        comment: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        created_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }
    }, {
        sequelize,
        modelName: 'TaskComment',
        timestamps: false
    });

    return TaskComment;
}; 