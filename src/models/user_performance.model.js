'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class UserPerformance extends Model {
        static associate(models) {
            UserPerformance.belongsTo(models.User, { foreignKey: 'user_id' });
            UserPerformance.belongsTo(models.Project, { foreignKey: 'project_id' });
        }
    }

    UserPerformance.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        project_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        total_tasks_assigned: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        tasks_completed: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        tasks_incompleted: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        tasks_completed_on_time: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        average_completion_time: {
            type: DataTypes.FLOAT,
            defaultValue: 0
        },
        bug_rate: {
            type: DataTypes.FLOAT,
            defaultValue: 0
        },
        average_rating: {
            type: DataTypes.FLOAT,
            defaultValue: 0
        },
        completion_rate: {
            type: DataTypes.FLOAT,
            defaultValue: 0
        },
        on_time_completion_rate: {
            type: DataTypes.FLOAT,
            defaultValue: 0
        },
        performance_score: {
            type: DataTypes.FLOAT,
            defaultValue: 0
        },
        updated_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }
    }, {

        sequelize,
        modelName: 'UserPerformance',
        timestamps: false,
        indexes: [
            {
                unique: true,
                fields: ['user_id', 'project_id']
            }
        ]

    });

    return UserPerformance;
}; 