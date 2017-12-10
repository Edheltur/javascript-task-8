'use strict';

const uuid = require('uuid/v4');
const Datastore = require('nedb');
const express = require('express');
const { responseAsJson, removeUndefinedProps, projectObject } = require('../utils');


const outputFormat = { '_id': 0, 'createdAt': 0 };
// eslint-disable-next-line new-cap
const router = express.Router();

const messages = new Datastore({ autoload: true });

router.get('/', (req, res) => {
    const from = req.query.from;
    const to = req.query.to;
    const query = removeUndefinedProps({ from, to });
    messages.find(query)
        .projection(outputFormat)
        .sort({ createdAt: 1 })
        .exec((err, docs) => {
            responseAsJson(err, res, docs);
        });

});

router.post('/', (req, res) => {
    const from = req.query.from;
    const to = req.query.to;
    const text = req.body.text;
    const id = uuid();
    const createdAt = new Date();
    messages.insert({ from, to, text, id, createdAt }, (err, doc) => {
        responseAsJson(err, res, projectObject(doc, outputFormat));
    });
});

router.delete('/:id', (req, res) => {
    const id = req.params.id;
    messages.remove({ id }, (err) => {
        responseAsJson(err, res, { 'status': 'ok' });
    });
});


router.patch('/:id', (req, res) => {
    const id = req.params.id;
    const text = req.body.text;
    const edited = true;
    messages.update({ id },
        { $set: { text, edited } },
        { returnUpdatedDocs: true }, (err, amount, doc) => {
            responseAsJson(err, res, projectObject(doc, outputFormat));
        });
});

module.exports = router;
