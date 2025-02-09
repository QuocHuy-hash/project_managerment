'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {

    class ProjectPhase extends Model {

        static associate(models) {
            ProjectPhase.belongsTo(models.Project, { foreignKey: 'project_id' });
            ProjectPhase.hasMany(models.Task, { foreignKey: 'phase_id' });
        }

    }

    ProjectPhase.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        project_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        description: DataTypes.TEXT,
        start_date: DataTypes.DATE,
        end_date: DataTypes.DATE,
        progress_rate: {
            type: DataTypes.FLOAT,
            defaultValue: 0
        },
        created_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW

        }
    }, {

        sequelize,
        modelName: 'ProjectPhase',
        timestamps: false

    });

    return ProjectPhase;
}; 