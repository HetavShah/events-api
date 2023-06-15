const express = require('express');
const router = express.Router();
const { client } = require('../../db/connection');
const myDB = client.db('event');
const Event = myDB.collection('event');
const fs = require('fs');
const { NotFoundError } = require('../../middlewares/errors/not-found-error');
const mongo = require('mongodb');

router.delete('/events/:id', async (req, res) => {
  let id = req.params.id;
  let event = await Event.findOne({ _id: new mongo.ObjectId(id) });
  if (!event) throw new NotFoundError('Event not found');
  fs.unlinkSync(event.image.path);
  await Event.deleteOne({ _id: event._id });

  return res.status(201).json({
    message: 'event deleted successfully',
  });
});

module.exports = {
  deleteEventRouter: router,
};
