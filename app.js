const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const expressJWT = require('express-jwt');

const app = express();
// 接收 post 请求 JSON 格式数据
const json = express.json({type: '*/json'});
const loginRouter = require('./router/login');
const operateStoreRouter = require('./router/operateStores');

app.use(cors());
app.use(json);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(function ( req, res, next) {
    res.sendCallback = function (err, status = 400) {
        res.send({
            status,
            message:err instanceof Error ? err.message : err
        })
    }
    next();
})
// 通过 token 进行接口鉴权认证, unless 是排除不需要token 鉴全
app.use(expressJWT({ secret: 'liuhuan' }).unless({ path: [/^\/api\//] }));

app.use('/api', loginRouter);
app.use('/main',operateStoreRouter);

app.use(function (err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
        return res.sendCallback('token 过期', 401);
    }
})
app.listen(8888, function () {
    console.log('api server runing 127.0.0.1:8888')
})