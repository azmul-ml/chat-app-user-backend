const jwt = require('jsonwebtoken');
const Joi = require('joi');
const mongoose = require('mongoose');
const { JWT_PRIVATE_KEY } = process.env;

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50
  },
  email: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 1024
  },
  roles: [{
    type: String
  }],
  profile_image_link: {
    type: String,
    default: null,
  }
}, { versionKey: false });

userSchema.methods.generateAuthToken = function() { 
  const token = jwt.sign({ user_id: this._id, email: this.email, name: this.name, roles: this.roles }, JWT_PRIVATE_KEY);
  return token;
}

userSchema.methods.adminPusherAuthToken = function() { 
  const token = jwt.sign({
    "roles": ["admin"]
  }, JWT_PRIVATE_KEY);
  return token;
}

userSchema.methods.userPusherAuthToken = function() { 
  const token = jwt.sign({
    user_id: this._id
  }, JWT_PRIVATE_KEY);
  return token;
}

const User = mongoose.model('User', userSchema);

function validateUser(user) {
  const schema = {
    name: Joi.string().min(5).max(50).required(),
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required(),
    roles: Joi.array().items(Joi.string())
  };

  return Joi.validate(user, schema);
}

function validateLogin(user) {
  const schema = {
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required()
  };

  return Joi.validate(user, schema);
}

function validatePusherPrivateChannel(pusher) {
  const schema = {
    socket_id: Joi.string().required(),
    channel_name: Joi.string().required()
  };

  return Joi.validate(pusher, schema);
}

exports.User = User; 
exports,validatePusherPrivateChannel = validatePusherPrivateChannel;
exports.validate = validateUser;
exports.validateLogin = validateLogin;