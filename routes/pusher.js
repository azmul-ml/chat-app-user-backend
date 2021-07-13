const express = require('express');
const asyncHandler = require('express-async-handler');
const Pusher = require('../startup/pusher');
const router = express.Router();
const {validatePusherPrivateChannel} = require('../models/user');

router.post('/auth', asyncHandler(async (req, res) => {
  const { error } = validatePusherPrivateChannel(req.body); 
  if (error) return res.status(400).send(error.details[0].message);
  
  const { socket_id, channel_name } = req.body; 

  try {
    const response = Pusher.authenticate(socket_id, channel_name);
    
    res.send(response);
  } catch(err) {
    res.status(400).send({status: 400, message: err});
  }
  
}));

module.exports = router; 