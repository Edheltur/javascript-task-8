'use strict';

function responseAsJson(err, res, result) {
    if (err) {
        res.status(500).json(err);
    } else {
        res.json(result);
    }
}

function removeProps(obj, shouldDelete) {
    const propNames = Object.getOwnPropertyNames(obj);
    for (let i = 0; i < propNames.length; i++) {
        const propName = propNames[i];
        if (shouldDelete(propName, obj[propName])) {
            delete obj[propName];
        }
    }

    return obj;
}

function removeUndefinedProps(obj) {
    return removeProps(obj, (key, value) => value === undefined);
}

function removeDbId(obj) {
    return removeProps(obj, key => key === '_id');
}

module.exports = { responseAsJson, removeProps, removeDbId, removeUndefinedProps };
