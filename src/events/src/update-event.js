const express = require('express');
const router = express.Router();
const { client } = require('../../db/connection');
const {check}=require('express-validator');
const {upload}=require('./multer');
const {validateRequest}=require('../../middlewares/validate-request');
const myDB = client.db('event');
const Event = myDB.collection('event');
const {BadRequestError}=require('../../middlewares/errors/bad-request-error');
const path=require('path');
const fs=require('fs');
const { NotFoundError } = require('../../middlewares/errors/not-found-error');
const mongo=require('mongodb');

router.put('/events/:id',upload.single('image'),
async (req, res) => {
  let {
    name,
    tagline,
    schedule,
    description,
    moderator,
    category,
    sub_category,
    rigor_rank
  } = req.body;
  let id=req.params.id;
  let image;
  if(req.file)
  {
    image = {
      data:fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
      path:req.file.path
  }
  }

  let event = await Event.findOne({_id:new mongo.ObjectId(id)});

  if(!event) throw new NotFoundError('Event not found');
  fs.unlinkSync(event.image.path);

  event.updatedAt=new Date();

  await Event.findOneAndUpdate({_id:event._id},{
    $set:{
    name,
    tagline,
    schedule,
    description,
    moderator,
    category,
    sub_category,
    rigor_rank,
    image,
    createdAt:event.createdAt,
    updatedAt:event.updatedAt
    }
  })



  return res.status(201).json({
    message:"event replaced successfully",
  });
});

module.exports = {
  updateEventRouter: router,
};
