const express = require('express');
const asyncHandler = require('express-async-handler');
const Pusher = require('../startup/pusher');
const router = express.Router();

router.post('/auth', asyncHandler(async (req, res) => {
  const { socket_id, channel_name } = req.body; 

  try {
    const response = Pusher.authenticate(socket_id, channel_name);
    res.send(response);
  } catch(err) {
    res.status(400).send({status: 400, message: err});
  }
  
}));


module.exports = router; 