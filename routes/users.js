const auth = require('../middleware/auth');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const {User, validate, validateLogin} = require('../models/user');
const express = require('express');
const router = express.Router();

router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.send(user);
  } catch(err) {
    res.status(400).send(err)
  }
  
});

router.post('/register', async (req, res) => {
  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);
  
  try {
    let user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).send('User already registered.');
  
    user = new User(_.pick(req.body, ['name', 'email', 'password', 'roles']));
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    await user.save();
    res.status(201).send(user);

  } catch(err) {
    res.status(400).send({status: 400, message: err});
  }
  
});

// User Login
router.post('/login', async (req, res) => {
  const { error } = validateLogin(req.body); 
  if (error) return res.status(400).send(error.details[0].message);
  
  try {
    const { email, password } = req.body;
    let user = await User.findOne({ email });
    if (!user) return res.status(400).send(res.status(400).send({status: 400, message: 'Invalid email or password.'}));
    
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).send({status: 400, message: 'Invalid email or password.'});

    const token = user.generateAuthToken();

    res.header('auth-token', token).status(200)
       .send({data: _.pick(user,  ['_id', 'profile_image_link', 'name', 'email']), token });

  } catch(err) {
    res.status(400).send({status: 400, message: err});
  }

});

module.exports = router; 
