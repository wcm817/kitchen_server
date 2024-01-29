// 导入校验规则的包
const joi = require('joi');

// 制定规则
const username = joi.string().alphanum().min(1).max(16).required();
const password = joi.string().pattern(/^[\S]{6,12}$/).required();

exports.login_user_rules = {
  body: {
    username,
    password
  }
}