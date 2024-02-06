// 导入数据库模块
const db = require('../db/index.js');

// 引入对密码进行加密的包
const bcryptjs = require("bcryptjs");
// 引入生成token的包
const jwt = require('jsonwebtoken');

// 注册处理函数 并导出
exports.registerHandler = (req, res) => {
  const { username, password } = req.body;
  // 查询是否有相同的用户名， 用户名唯一
  const sql = 'select username from user_login where username=?';
  // 执行sql语句
  db.query(sql, username, (err, result) => {
    if (err) return res.output({ msg: err });
    if (result.length === 1) {
      // 执行成功有数据，则证明存在相同的用户名
      return res.output({ msg: '用户名已被占用' });
    }
    // 执行成功 用户名没被占用，则存入数据库
    console.log('加密之前密码', password);
    // 对密码进行加密，第二个参数可以提高密码的安全性
    const newPassword = bcryptjs.hashSync(password, 10);
    console.log('加密之后密码', newPassword);

    const insertSql = 'insert into user_login set ?';
    db.query(insertSql, { username, password: newPassword }, (subErr, subResult) => {
      if (subErr) return res.output({ msg: subErr });
      // 执行sql语句成功 但影响行数不为1
      if (subResult.affectedRows !== 1) return res.output({ msg: '用户注册失败！' });
      res.output({
        code: 0,
        msg: '注册成功'
      });
    });
  });
}

// 登录助理函数 并导出
exports.loginHandler = (req, res) => {
  const { username, password } = req.body;
  const sql = 'select * from user_login where username=?';
  db.query(sql, username, (err, result) => {
    if (err) return res.output({ msg: err });
    if (result.length !== 1) {
      // 如果语句执行成功，但是没有查出username相关记录，则用户名不存在
      return res.output({ msg: '用户不存在！' });
    }
    // 如果用户存在，继续继承密码校验，注意：数据库中存储的是加密后的密码
    /*
    要比对密码是否相同，比对密码还是用到  bcryptjs  包，用到其中compareSync()方法，这个方法有两个参数，第一个是从客户端传来的密码，第二个参数是在数据库中存储经过加密的密码，根据结果会返回true或false
    */
    const flag = bcryptjs.compareSync(password, result[0].password);
    if (!flag) return res.output({ msg: '密码错误，登录失败！' });

    // 密码比对正确，在服务端生成token: 获取用户信息，剔除密码，生成token
    const user = {
      ...result[0],
      password: ''
    };
    const tokenStr = jwt.sign(
      user,
      'secret123456', // 密钥
      {
        expiresIn: 3600 * 24 // 过期时间
      }
    );
    // token客户端不能直接用，需要在前面加 'Bearer '，返回的时候将这个加上，前端就能直接用了。
    res.output({
      code: 0,
      msg: '登录成功',
      data: {
        token: "Bearer " + tokenStr,
        username
      }
    });
  });
}