// 引入express
const express = require('express');

// 创建服务器示例对象
const app = express();

// 中间件
const Joi = require('joi'); // 请求的数据校验
const { expressjwt: jwt } = require('express-jwt'); // 解析token
const cors = require('cors')(); // 跨域
app.use(cors);
// 解析 Content-Type: application/json类型 post请求的body参数
app.use(express.json());
// 配置解析表单数据的中间件  内置中间件，只能解析application/x-www-form-urlencoded格式的数据
app.use(express.urlencoded({ extended: false }));


// 封装res.send(), 必须在路由前封装
app.use((req, res, next) => {
  // 定义一个输出函数
  res.output = ({ msg, code = 1, data }) => {
    res.send({
      code,
      message: msg instanceof Error ? msg.message : msg,
      data
    });
  };
  next();
});

// 定义中间件，需要哪个密钥解析，.unless指定哪些接口不需要进行token身份认证
app.use(
  jwt({
    secret: 'secret123456',
    algorithms: ['HS256']
  }).unless({
    path: ['/login', '/register'],
  })
)

// 导入并使用路由模块
const router = require('./router/index.js');
app.use(router);

// 所有路由调用下面的错误中间件
app.use((err, req, res, next) => {
  // 数据校验检测出的错误
  if (err instanceof Joi.ValidationError) {
    return res.output({ msg: err });
  }
  // 其他未知错误
  res.output({ msg: err });
  next();

});

// 启动服务器监听
app.listen(3399, () => {
  console.log('Server running at http://127.0.0.1:3399');
})