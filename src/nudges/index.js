const express=require('express');
const nudgeRouter=express.Router();
const {createNudgeRouter}=require('./src/create-nudge');
const { updateNudgeRouter } = require('./src/update-nudge');
const { deleteNudgeRouter } = require('./src/delete-nudge');
const { getNudgeByIdRouter } = require('./src/get-nudge-by-id');

nudgeRouter.use(createNudgeRouter);
nudgeRouter.use(updateNudgeRouter);
nudgeRouter.use(deleteNudgeRouter);
nudgeRouter.use(getNudgeByIdRouter);
module.exports={nudgeRouter};