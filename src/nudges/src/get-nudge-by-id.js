const express = require('express');
const router = express.Router();
const { client } = require('../../db/connection');
const myDB = client.db('nudge');
const Nudge = myDB.collection('nudge');
const fs = require('fs');
const { NotFoundError } = require('../../middlewares/errors/not-found-error');
const mongo = require('mongodb');

router.get('/nudges/:id', async (req, res) => {
  let id = req.params.id;
  let nudge = await Nudge.findOne({ _id: new mongo.ObjectId(id) });
  if (!nudge) throw new NotFoundError('Nudge not found');

  return res.status(200).json(nudge);
});

module.exports = {
  getNudgeByIdRouter: router,
};
