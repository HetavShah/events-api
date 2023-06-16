const express = require('express');
const router = express.Router();
const { client } = require('../../db/connection');
const { check } = require('express-validator');
const { upload } = require('./multer');
const { validateRequest } = require('../../middlewares/validate-request');
const myDB = client.db('nudge');
const Nudge = myDB.collection('nudge');
const {
  BadRequestError,
} = require('../../middlewares/errors/bad-request-error');
const path = require('path');
const fs = require('fs');

router.post(
  '/nudges',
  upload.fields([
    {
      name: 'image',
      maxCount: 1,
    },
    {
      name: 'icon',
      maxCount: 1,
    },
  ]),
  [
    check('title')
      .notEmpty()
      .withMessage('title is required')
      .isLength({
        min: 1,
        max: 60,
      })
      .withMessage('title must be less then 60 characters'),
    check('type')
      .notEmpty()
      .withMessage('type is required')
      .custom((input) => {
        if (input === 'event' || input === 'article') return true;
        return false;
      })
      .withMessage("type must be one of 'event', 'article' "),
    check('invitation').notEmpty().withMessage('invitation is required'),
    check('tags').isArray().withMessage('tags must be an array'),
    check('tags.*')
      .isMongoId()
      .withMessage('each tag item must be a valid Event or Article id'),
    check('start_time').notEmpty().withMessage('start_time is required'),
    check('end_time').notEmpty().withMessage('end_time is required'),
    check('description').notEmpty().withMessage('description is required'),
  ],
  validateRequest,
  async (req, res) => {
    let { title, tags, type, invitation, start_time, end_time, description } =
      req.body;
    if (req.files['image'].length == 0) {
      throw new BadRequestError('image is required');
    }
    const url = req.protocol + ':\\' + req.get('host');
    const newImgUrl = path.join(
      url,
      `/public/${req.files['image'][0].filename}`
    );
    let image = {
      filename: req.files['image'][0].filename,
      path: req.files['image'][0].path,
      url: newImgUrl,
    };

    let icon = undefined;
    if (req.files['icon']) {
      const newIconUrl = path.join(
        url,
        `/public/${req.files['icon'][0].filename}`
      );
      icon = {
        filename: req.files['icon'][0].filename,
        path: req.files['icon'][0].path,
        url: newIconUrl,
      };
    }

    let nudge = await Nudge.insertOne({
      type,
      tags,
      title,
      invitation,
      start_time: new Date(start_time).toUTCString(),
      end_time: new Date(end_time).toUTCString(),
      description,
      image,
      icon,
    });
    return res.status(201).json({
      id: nudge.insertedId,
    });
  }
);

module.exports = {
  createNudgeRouter: router,
};
