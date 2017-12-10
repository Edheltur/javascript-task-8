'use strict';

const Datastore = require('nedb');
const uuid = require('uuid/v4');
const express = require('express');
const { responseAsJson, removeDbId, removeUndefinedProps } = require('../utils');

// eslint-disable-next-line new-cap
const router = express.Router();

const messages = new Datastore({ filename: 'db/messages,json', autoload: true });

router.get('/', (req, res) => {
    const from = req.query.from;
    const to = req.query.to;
    const query = removeUndefinedProps({ from, to });
    messages.find(query, { '_id': 0 }, (err, docs) => {
        responseAsJson(err, res, docs);
    });

});

router.post('/', (req, res) => {
    const from = req.query.from;
    const to = req.query.to;
    const text = req.body.text;
    const id = uuid();
    messages.insert({ from, to, text, id }, (err, doc) => {
        responseAsJson(err, res, removeDbId(doc));
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
            responseAsJson(err, res, removeDbId(doc));
        });
});

module.exports = router;
