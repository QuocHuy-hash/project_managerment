const _ = require('lodash');

const getInfoData = ({ fileds = [], object = {} }) => {
    return _.pick(object, fileds);
}
const removeEmptyFields = (data) => {
    return Object.entries(data).reduce((a, [k, v]) => {
        if (v != null) {
            a[k] = v;
            if (typeof v === 'object' && !Array.isArray(v)) {
                a[k] = removeEmptyFields(v);
            } else {
                a[k] = v;
            }
        }
        return a;
    }, {});
}
const removeEmptyFieldsSequelize = (data) => {
    if (data === null || typeof data !== 'object') {
        return data;
    }

    // Xử lý đối tượng Sequelize
    if (data.dataValues) {
        data = data.dataValues;
    }

    // Xử lý mảng
    if (Array.isArray(data)) {
        return data.map(item => removeEmptyFields(item));
    }

    // Xử lý đối tượng thông thường
    return Object.entries(data).reduce((acc, [key, value]) => {
        if (value !== null && value !== undefined) {
            // Xử lý đối tượng Date
            if (value instanceof Date) {
                acc[key] = value;
            } else if (typeof value === 'object') {
                const cleanedValue = removeEmptyFields(value);
                if (Object.keys(cleanedValue).length > 0) {
                    acc[key] = cleanedValue;
                }
            } else {
                acc[key] = value;
            }
        }
        return acc;
    }, {});
};
module.exports = {
    getInfoData,
    removeEmptyFields,
    removeEmptyFieldsSequelize
}