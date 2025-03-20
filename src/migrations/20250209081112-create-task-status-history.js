'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('TaskStatusHistories', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      task_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Tasks',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      is_late: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      old_status: {
        type: Sequelize.ENUM('To Do', 'In Progress', 'Ready for Test', 'Has Bug', 'Tested', 'Released')
      },
      new_status: {
        type: Sequelize.ENUM('To Do', 'In Progress', 'Ready for Test', 'Has Bug', 'Tested', 'Released'),
        allowNull: false
      },
      changed_by: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      comment: {
        type: Sequelize.TEXT
      },
      change_date: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
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
    await queryInterface.dropTable('TaskStatusHistories');
  }
};