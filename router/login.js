const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();

const db = require('../db');

router.post('/login', function (req, res) {
    const body = req.body;
    const sql = 'select username,password,ipone from use_info where username=?';
    db.query(sql, body.username, function (err, result) {
        if (err) return res.sendCallback(err.message);
        if (result.length === 0) return res.sendCallback('账号未注册');
        const compareResult = bcrypt.compareSync(body.password,result[0].password);
        if (compareResult) {
            const user = { username:body.username, ipone:body.ipone };
            const token = jwt.sign({ ...user }, 'liuhuan', { expiresIn: '12h' });
            res.send({
                status: 200,
                token: 'Bearer ' + token,
                name: body.username,
                message:'登录成功！'
            })
        } else {
            res.sendCallback('密码错误');
        }
    })
})

router.post('/register', function (req, res) {
    const body = req.body;
    const sql = 'select ipone,username from use_info where ipone=? or username=?';
    db.query(sql, [body.ipone,body.username], function (err, result) {
        if (err) return res.sendCallback(err.message);
        if (result.length > 0) {
            if (result.some(item => item.username === body.username)) {
                return res.sendCallback('账号名已经被注册了！');
            } else if(result.some(item => item.ipone === body.ipone)) {
                return res.sendCallback('电话号码已被注册！');
            }
            
        }
        const user = { username:body.username, ipone:body.ipone };
        const token = jwt.sign({ ...user }, 'liuhuan', { expiresIn: '12h' });
        body.password = bcrypt.hashSync(body.password, 10);
        const regsiterSql = 'insert into use_info set ?';
        db.query(regsiterSql, body, function (regErr, regResult) {
            if (regErr) return res.sendCallback(regErr.message);
            if (regResult.affectedRows !== 1) return res.sendCallback('注册失败!');
            res.send({
                status: 200,
                message: '注册成功！',
                token: 'Bearer ' + token,
                name: body.username,
            })
        })
    })
})

module.exports = router;