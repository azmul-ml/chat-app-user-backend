const auth = require('../middleware/auth');
const express = require('express');
const {User} = require('../models/user');
const asyncHandler = require('express-async-handler');
const router = express.Router();

router.post('/token', auth, asyncHandler(async (req, res) => {
  const { roles , user_id} = req.user;

  try {
    let user = await User.findOne({ _id: user_id });
    if (!user) return res.status(400).send(res.status(400).send({status: 400, message: 'Invalid User'}));
   
    if(roles.length === 1) {
      const token = user.adminPusherAuthToken();
      res.send(token);
    } else {
      const token = user.userPusherAuthToken();
      res.send(token);
    }

  } catch(err) {
    res.status(400).send({status: 400, message: err});
  }
  
}));

module.exports = router; 