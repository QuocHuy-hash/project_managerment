'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class TaskDiscussion extends Model {
        static associate(models) {
            TaskDiscussion.belongsTo(models.Task, { foreignKey: 'task_id' });
            TaskDiscussion.belongsTo(models.User, { foreignKey: 'user_id' });
        }
    }

    TaskDiscussion.init({
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
        discussion: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        is_review: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
    }, {
        sequelize,
        modelName: 'TaskDiscussion',
        timestamps: false
    });

    return TaskDiscussion;
}; 