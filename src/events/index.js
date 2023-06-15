const express=require('express');
const eventRouter=express.Router();
const {createEventRouter}=require('./src/create-event');
const { updateEventRouter } = require('./src/update-event');
const { deleteEventRouter } = require('./src/delete-event');
const { getEventByIdRouter } = require('./src/get-event-by-id');
const { getEventByTypeRouter } = require('./src/get-event-by-type');

eventRouter.use(createEventRouter);
eventRouter.use(updateEventRouter);
eventRouter.use(deleteEventRouter);
eventRouter.use(getEventByIdRouter);
eventRouter.use(getEventByTypeRouter);
module.exports={eventRouter};