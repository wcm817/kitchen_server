// 导入校验规则的包
const joi = require('joi');

// 制定规则
const firstname = joi.string().alphanum().min(1).max(36).required();
const lastname = joi.string().alphanum().min(1).max(16).required();
const phonecode = joi.string().min(1).max(16).required();
const phone = joi.string().required();
const email = joi.string().email().required();
const message = joi.string().min(1).max(300).required();

exports.comment_rules = {
  body: {
    firstname,
    lastname,
    phonecode,
    phone,
    email,
    message
  }
}