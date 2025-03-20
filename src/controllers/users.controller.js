'use strict'

const { CreatedResponse, SuccessResponse } = require("../core/success.response");
const { login, createUser, listUser } = require("../services/user.service");

const HEADER = {
    CLIENT_ID: 'x-client-id',
};

class UsersController {
    login = async (req, res, next) => {
        new SuccessResponse({
            message: 'login Success',
            metadata: await login(req.body),
        }).send(res)
    }
    listUser = async (req, res, next) => {
        new SuccessResponse({
            message: 'get list users Success',
            metadata: await listUser(),
        }).send(res)
    }
    createUser = async (req, res, next) => {
        console.log("createUse111r", req.body);

        new CreatedResponse({
            message: 'create user success',
            metadata: await createUser(req.body),
            options: {
                limit: 10
            }
        }).send(res)
    }
}

module.exports = new UsersController();