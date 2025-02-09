'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Tasks', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        allowNull: false,
        type: Sequelize.STRING(100)
      },
      description: {
        type: Sequelize.TEXT
      },
      project_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'Projects',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      phase_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'ProjectPhases',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      parent_task_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Tasks',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      assigned_to: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      start_date: {
        type: Sequelize.DATE
      },
      deadline: {
        type: Sequelize.DATE
      },
      actual_completion_date: {
        type: Sequelize.DATE
      },
      estimated_hours: {
        type: Sequelize.FLOAT
      },
      actual_hours: {
        type: Sequelize.FLOAT
      },
      status: {
        type: Sequelize.ENUM('To Do', 'In Progress', 'Ready for Test', 'Has Bug', 'Tested', 'Released'),
        defaultValue: 'To Do'
      },
      priority: {
        type: Sequelize.ENUM('Low', 'Medium', 'High', 'Urgent'),
        defaultValue: 'Medium'
      },
      completion_rate: {
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
    await queryInterface.dropTable('Tasks');
  }
};
