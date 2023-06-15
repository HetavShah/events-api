const express = require('express');
const router = express.Router();
const { client } = require('../../db/connection');
const myDB = client.db('event');
const Event = myDB.collection('event');
const fs = require('fs');
const { NotFoundError } = require('../../middlewares/errors/not-found-error');
const mongo = require('mongodb');

router.get('/events', async (req, res) => {

  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);
  const startIndex = (page - 1) * limit;
    const result = Event.find().limit(limit).skip(startIndex).sort({schedule:1});
  const count=await Event.countDocuments();
  let events=[];
    for await (const doc of result)
    {
      events.push(doc);
    }

  return res.status(201).json({
    events,
    totalPages:Math.ceil(count/limit),
    currentPage:page
  });
});

module.exports = {
  getEventByTypeRouter: router,
};
