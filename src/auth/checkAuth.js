'use strict';

const asyncHandle = _ => {
    return (req, res, next) => {
        _(req, res, next).catch(next)
    }
}

module.exports = {
    asyncHandle,
}