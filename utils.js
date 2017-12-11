'use strict';

function responseAsJson(err, res, result) {
    if (err) {
        res.status(500).json(err);
    } else {
        res.json(result);
    }
}

function responseNotFoundAsJson(res) {
    res.status(404).send({ status: 'not found' });
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

function projectObject(obj, projection) {
    return removeProps(obj, key => projection[key] === 0);
}

module.exports = { responseAsJson, projectObject, removeUndefinedProps, responseNotFoundAsJson };
