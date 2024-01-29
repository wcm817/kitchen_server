const express = require('express');
const router = express.Router();

// 注册、登录处理函数
const { registerHandler, loginHandler } = require('../router_handler/login.js');
// 留言处理函数
const { commentHanlder } = require('../router_handler/comment.js');

// 数据规则
const { login_user_rules } = require('../schema/login.js');
const { comment_rules } = require('../schema/comment.js');
// 导入校验规则的中间件
const expressJoi = require('@escook/express-joi');

// 注册路由
router.post('/register', expressJoi(login_user_rules), registerHandler);
// 登录路由
router.post('/login', expressJoi(login_user_rules), loginHandler);
// 留言路由
router.post('/addComment', expressJoi(comment_rules), commentHanlder);


module.exports = router;