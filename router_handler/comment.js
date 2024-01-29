// 引入数据库
const db = require('../db/index');

exports.commentHanlder = (req, res) => {
  const data = req.body;
  const sql = "insert into comment set ?";
  db.query(sql, data, (err, result) => {
    if (err) return res.output({ msg: err });
    if (result.affectedRows !== 1) return res.output({ msg: '留言失败！' });
    return res.output({
      code: 0,
      msg: '留言成功！'
    })
  })
}