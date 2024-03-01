//  引入mysql
const mysql = require('mysql');

// 建立一个连接数据库的连接池
const db = mysql.createPool({
  host: "127.0.0.1", // 数据库的IP地址(本地的或者是云服务器的都可以)
  port: '3306', // mysql默认端口是3306
  user: 'root', // mysql客户端用户名
  password: 'root', // mysql客户端密码
  database: 'kitchen' // 要连接的数据库名称
});

// 监测数据是否连接成功： 直接node运行这个文件
// db.query("select 1", (err, results) => {
//   if (err) return console.log(err);
//   console.log(results);
// });

// 将文件暴露出去
module.exports = db;