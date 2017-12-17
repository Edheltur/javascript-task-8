'use strict';

const uuid = require('uuid/v4');
const Datastore = require('nedb');
const express = require('express');
const {
    responseAsJson,
    removeUndefinedProps,
    projectObject,
    responseNotFoundAsJson,
    responseBadRequestAsJson
} = require('../utils');


const outputFormat = { '_id': 0, 'createdAt': 0 };
// eslint-disable-next-line new-cap
const router = express.Router();

const messages = new Datastore({ autoload: true });

router.get('/', (req, res) => {
    const { from, to } = req.query;
    const query = removeUndefinedProps({ from, to });
    messages.find(query)
        .projection(outputFormat)
        .sort({ createdAt: 1 })
        .exec((err, docs) => {
            responseAsJson(err, res, docs);
        });

});

router.post('/', (req, res) => {
    const { from, to } = req.query;
    const { text } = req.body;
    if (!text) {
        return responseBadRequestAsJson(res);
    }
    const id = uuid();
    const createdAt = new Date();
    messages.insert({ from, to, text, id, createdAt }, (err, doc) => {
        responseAsJson(err, res, projectObject(doc, outputFormat));
    });
});

router.delete('/:id', (req, res) => {
    const { id } = req.params;
    messages.remove({ id }, (err, amount) => {
        if (!err && amount === 0) {
            responseNotFoundAsJson(res);
        } else {
            responseAsJson(err, res, { status: 'ok' });
        }
    });
});


router.patch('/:id', (req, res) => {
    const { id } = req.params;
    const { text } = req.body;
    if (!text) {
        return responseBadRequestAsJson(res);
    }
    const edited = true;
    messages.update({ id },
        { $set: { text, edited } },
        { returnUpdatedDocs: true }, (err, amount, doc) => {
            if (!err && amount === 0) {
                responseNotFoundAsJson(res);
            } else {
                responseAsJson(err, res, projectObject(doc, outputFormat));
            }
        });
});

router.use(function (req, res) {
    responseNotFoundAsJson(res);
});

module.exports = router;
