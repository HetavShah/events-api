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
const { NotFoundError } = require('../../middlewares/errors/not-found-error');
const mongo = require('mongodb');

router.put(
  '/nudges/:id',
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
  async (req, res) => {
    let { title, tags, type, invitation, start_time, end_time, description } =
      req.body;
    let id = req.params.id;
    let image;
    const url = req.protocol + ':\\' + req.get('host');
    if (req.files['image']) {
      const newImgUrl = path.join(
        url,
        `/public/${req.files['image'][0].filename}`
      );
      image = {
        filename: req.files['image'][0].filename,
        path: req.files['image'][0].path,
        url: newImgUrl,
      };
    }
    let icon;
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

    let nudge = await Nudge.findOne({ _id: new mongo.ObjectId(id) });

    if (!nudge) throw new NotFoundError('Nudge not found');
    fs.unlinkSync(nudge.image.path);
    if (icon && nudge.icon) fs.unlinkSync(nudge.icon.path);

    await Nudge.findOneAndUpdate(
      { _id: nudge._id },
      {
        $set: {
          type,
          tags,
          title,
          invitation,
          start_time: new Date(start_time).toUTCString(),
          end_time: new Date(end_time).toUTCString(),
          description,
          image,
          icon,
        },
      }
    );

    return res.status(201).json({
      message: 'nudge replaced successfully',
    });
  }
);

module.exports = {
  updateNudgeRouter: router,
};
