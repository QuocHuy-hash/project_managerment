'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Projects', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT
      },
      owner_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        }
      },
      start_date: Sequelize.DATE,
      end_date: Sequelize.DATE,
      status: {
        type: Sequelize.ENUM('Planning', 'In Progress', 'On Hold', 'Completed', 'Cancelled'),
        defaultValue: 'Planning'
      },
      total_tasks: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      completed_tasks: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      progress_rate: {
        type: Sequelize.FLOAT,
        defaultValue: 0
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Projects');
  }
};