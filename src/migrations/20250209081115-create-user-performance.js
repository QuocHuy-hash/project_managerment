'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('UserPerformances', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      project_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Projects',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      total_tasks_assigned: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      tasks_completed: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      tasks_incompleted: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      tasks_completed_on_time: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      average_completion_time: {
        type: Sequelize.FLOAT,
        defaultValue: 0
      },
      bug_rate: {
        type: Sequelize.FLOAT,
        defaultValue: 0
      },
      average_rating: {
        type: Sequelize.FLOAT,
        defaultValue: 0
      },
      completion_rate: {
        type: Sequelize.FLOAT,
        defaultValue: 0
      },
      on_time_completion_rate: {
        type: Sequelize.FLOAT,
        defaultValue: 0
      },
      performance_score: {
        type: Sequelize.FLOAT,
        defaultValue: 0
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('UserPerformances');
  }
};
