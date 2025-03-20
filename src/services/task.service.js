'use strict';

const { BadRequestError, NotFoundError } = require('../core/error.response');
const { Task, Project, User, UserPerformance, TaskStatusHistory, TaskAssignment, sequelize } = require('../models');
const { removeEmptyFields, removeEmptyFieldsSequelize } = require('../utils');

class TaskService {
    async createTask(task, userId) {
        const { project_id, title, description, phase_id, parent_task_id,
            assigned_to, start_date, deadline, estimated_hours, priority } = task;

        if (!title || !project_id || !assigned_to) {
            throw new BadRequestError('Title, project_id, and assigned_to are required');
        }

        return await sequelize.transaction(async (t) => {
            const [existingProject, assignedUser] = await Promise.all([
                Project.findByPk(project_id, { transaction: t }),
                User.findByPk(assigned_to, { transaction: t })
            ]);

            if (!existingProject) throw new NotFoundError('Invalid project_id');
            if (existingProject.owner_id != userId) throw new BadRequestError('You do not have permission to create tasks for this project', 403);
            if (!assignedUser) throw new NotFoundError('Invalid assigned_to user', 403);

            const newTask = await Task.create({
                project_id,
                title,
                description,
                phase_id,
                parent_task_id,
                assigned_to,
                start_date,
                deadline,
                estimated_hours,
                priority
            }, { transaction: t });

            await Project.increment('total_tasks', { where: { id: project_id }, transaction: t });

            const [userPerformance] = await UserPerformance.findOrCreate({
                where: { user_id: assigned_to, project_id },
                defaults: { total_tasks_assigned: 0, tasks_completed: 0, tasks_incompleted: 0 },
                transaction: t
            });

            await userPerformance.increment('total_tasks_assigned', { transaction: t });

            await TaskAssignment.create({ task_id: newTask.id, user_id: assigned_to }, { transaction: t });

            return newTask;
        });
    }
    async updateTaskStatus(body, userId) {
        const { taskId, newStatus } = body;

        return await sequelize.transaction(async (t) => {
            const task = await Task.findByPk(taskId, { transaction: t });
            if (!task) throw new NotFoundError('Task not found');
            if (task.assigned_to != userId) throw new BadRequestError('You do not have permission to update this task', 403);
            if (task.status == newStatus) throw new BadRequestError(`The status of the task is already ${newStatus}`);

            const oldStatus = task.status;
            task.status = newStatus;
            await task.save({ transaction: t });

            const isLate = (newStatus == 'Released' && task.deadline && new Date() > new Date(task.deadline)) ? 1 : 0;
            const actualCompletionDate = newStatus == 'Released' ? new Date() : null;

            await TaskStatusHistory.create({
                task_id: taskId,
                changed_by: userId,
                old_status: oldStatus,
                new_status: newStatus,
                is_late: isLate,
                change_date: new Date()
            }, { transaction: t });

            const userPerformance = await UserPerformance.findOne({
                where: { user_id: task.assigned_to, project_id: task.project_id },
                transaction: t
            });

            if (!userPerformance) {
                throw new NotFoundError('User performance record not found');
            }

            if (newStatus == 'Released') {
                await Project.increment('completed_tasks', { where: { id: task.project_id }, transaction: t });

                await userPerformance.increment('tasks_completed', { transaction: t });
                if (isLate) {
                    await userPerformance.increment('tasks_completed_late', { transaction: t });
                } else {
                    await userPerformance.increment('tasks_completed_on_time', { transaction: t });
                }

                // Cập nhật thời gian hoàn thành trung bình
                const completedTasks = userPerformance.tasks_completed + 1;
                const newAvgCompletionTime = userPerformance.tasks_completed > 0
                    ? (userPerformance.average_completion_time * (completedTasks - 1) + (actualCompletionDate - task.start_date)) / completedTasks
                    : 0;
                await userPerformance.update({ average_completion_time: newAvgCompletionTime }, { transaction: t });

            } else if (oldStatus == 'Released' && newStatus != 'Released') {
                if (userPerformance.tasks_completed > 0) {
                    await userPerformance.decrement('tasks_completed', { transaction: t });
                }
                await userPerformance.increment('tasks_incompleted', { transaction: t });

                if (isLate && userPerformance.tasks_completed_late > 0) {
                    await userPerformance.decrement('tasks_completed_late', { transaction: t });
                } else if (!isLate && userPerformance.tasks_completed_on_time > 0) {
                    await userPerformance.decrement('tasks_completed_on_time', { transaction: t });
                }
            }

            // Xử lý trường hợp task có bug
            if (newStatus == 'Has Bug') {
                await userPerformance.increment('tasks_with_bugs', { transaction: t });
            } else if (oldStatus == 'Has Bug' && newStatus !== 'Has Bug' && userPerformance.tasks_with_bugs > 0) {
                await userPerformance.decrement('tasks_with_bugs', { transaction: t });
            }

            //  Cập nhật các tỷ lệ thống kê
            const completionRate = userPerformance.total_tasks_assigned > 0
                ? (userPerformance.tasks_completed / userPerformance.total_tasks_assigned) * 100
                : 0;

            const onTimeCompletionRate = userPerformance.tasks_completed > 0
                ? (userPerformance.tasks_completed_on_time / userPerformance.tasks_completed) * 100
                : 0;

            const bugRate = userPerformance.total_tasks_assigned > 0
                ? (userPerformance.tasks_with_bugs / userPerformance.total_tasks_assigned) * 100
                : 0;

            await userPerformance.update({
                completion_rate: completionRate,
                on_time_completion_rate: onTimeCompletionRate,
                bug_rate: bugRate
            }, { transaction: t });

            return task;
        });
    }


    async getProjectStatistics(projectId) {
        console.log("ProjectId:::", projectId)
        const project = await Project.findByPk(projectId, {
            include: [
                {
                    model: Task,
                    as: 'tasks',
                    required: false, //tránh vòng lặp vô hạn ("Maximum call stack size exceeded")
                    include: [
                        {
                            model: User,
                            as: 'Assignees',
                            attributes: ['id', 'name', 'email'], // Lấy thêm email của User
                            required: false,
                        }
                    ]
                },
            ]
        });

        if (!project) {
            throw new NotFoundError('Project not found');
        }
        // const task = project.tasks && project.tasks.map(task => { return removeEmptyFieldsSequelize(task.dataValues) });
        return {
            project: {
                id: project.id,
                name: project.name,
                total_tasks: project.total_tasks,
                completed_tasks: project.completed_tasks,
                progress_rate: project.progress_rate
            },
            tasks: project.tasks,
        };
    }
}

module.exports = new TaskService();