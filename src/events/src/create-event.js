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

router.post('/events',upload.single('image'),[
check('name').notEmpty().withMessage('name is required'),
check('tagline').notEmpty().withMessage('tagline is required'),
check('schedule').notEmpty().withMessage('schedule is required'),
check('description').notEmpty().withMessage('description is required'),
check('moderator').notEmpty().withMessage('moderator is required'),
check('category').notEmpty().withMessage('category is required'),
check('sub_category').notEmpty().withMessage('sub_category is required'),
check('rigor_rank').notEmpty().withMessage('rigor_rank is required').isInt().withMessage('rigor_rank must be an integer')
],validateRequest, async (req, res) => {
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
  if(!req.file){
    throw new BadRequestError('image is required');
  }
  const url = req.protocol + ':\\' + req.get('host');
  const newImgUrl=path.join(url,`/public/${req.file.filename}`)
  let image = {
    filename:req.file.filename,
    path:req.file.path,
    url:newImgUrl
}
  let event = await Event.insertOne({
    type:"event",
    name,
    tagline,
    schedule:new Date(schedule),
    description,
    moderator,
    category,
    sub_category,
    rigor_rank,
    image,
    createdAt:new Date(),
    updatedAt:new Date(),
  });
  return res.status(201).json({
    id: event.insertedId,
  });
});

module.exports = {
  createEventRouter: router,
};
