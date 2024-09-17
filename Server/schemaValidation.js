const Joi = require('joi');


module.exports.userSchema = Joi.object({
  email: Joi.string().required(),
  username: Joi.string().required(),
  password: Joi.string().required()

});

module.exports.profileSchema = Joi.object({
  fullname: Joi.string().required(),
  about: Joi.string().required(),
  dp: Joi.string().required(),
  links: Joi.object({
  website: Joi.string().required(),
  twitter: Joi.string().required(),
  linkedin: Joi.string().required(),}),
  interests: Joi.array().items(Joi.string()).required(),
});