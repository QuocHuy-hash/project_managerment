'use strict'
const bcrypt = require('bcrypt');
const crypto = require('node:crypto');
const { getInfoData } = require('../utils');

const { createTokenPair } = require("../auth/authUtil");
const { BadRequestError, AuthFailureError } = require("../core/error.response");
const { User } = require("../models");
const { findByUserName } = require("../models/repositoris/user.repo");
const { KeyTokenService } = require('./key.token.service');

const login = async ({ username, password, refreshToken = null }) => {
    //1.
    console.log(username, password);
    const foundUser = await findByUserName({ username });

    if (!foundUser) {
        throw new BadRequestError('User not found');
    }

    //2.
    const match = await bcrypt.compare(password, foundUser.password);
    if (!match) {
        throw new AuthFailureError('Authentication error');
    }
    console.log("match", match);

    //3.
    const privateKey = crypto.randomBytes(64).toString('hex');
    const publicKey = crypto.randomBytes(64).toString('hex');

    //4.
    const tokens = await createTokenPair({ userId: foundUser.id, username }, publicKey, privateKey);

    await KeyTokenService({
        userId: foundUser.id,
        refreshToken: tokens.refreshToken,
        privateKey, publicKey
    });
    //Send Mail

    return {
        user: { id: foundUser.id, username: foundUser.username, email: foundUser.email },
        tokens
    }
}
const createUser = async (user) => {
    const { username, password, email, role } = user;
    console.log("createUser", username, password, email, role);
    const passwordHash = await bcrypt.hash(password, 10);

    // Check if the username already exists in the database
    const existingUser = await User.findOne({ where: { username: username } });

    // If the username already exists, return an error
    if (existingUser) {
        throw new BadRequestError('Error : User already created');
    }
    const newUser = await User.create({
        username, password: passwordHash, email, role
    });
    if (newUser) {

        const privateKey = crypto.randomBytes(64).toString('hex');
        const publicKey = crypto.randomBytes(64).toString('hex');

        const keyStore = await KeyTokenService({
            userId: newUser.id,
            publicKey,
            privateKey,
            refreshToken: '111'
        });
        if (!keyStore) {
            return;
        }
        const tokens = await createTokenPair({ userId: newUser.id, username }, publicKey, privateKey);
        return {
            code: '201',
            metadata: {
                user: getInfoData({ fileds: ['id', 'username'], object: newUser }),
                tokens
            }
        }
    }

};
const listUser = async () => {
    const attribute = ['id', 'username', 'email', 'role', 'total_projects', 'performance_score', 'average_rating'];
    return await User.findAll(
        {
            attributes: attribute
        }
    );
}
module.exports = { login, createUser, listUser }