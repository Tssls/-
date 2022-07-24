const express = require('express');
const db = require('../db');

const router = express.Router();

router.get('/query', function (req, res) {
    const {
        page,
        pageSize,
        name = '',
        city = ''
    } = req.query;
    const condition = `${name ? `and name="${name}"` : ''} ${city ? `and city="${city}"` : ''}`
    const sqlCount = `select count(*) as total from stores_info where status!=0 ${condition}`;
    db.query(sqlCount, function (coErr, coRes) {
        if (coErr) return res.sendCallback(err.message);
        if (coRes && coRes.length > 0) {
            const sql = `select * from stores_info where status!=0 ${condition} limit ?,?`;
            db.query(sql, [Number(page), Number(pageSize)], function (err, result) {
                if (err) return res.sendCallback(err.message);
                result = result.map(item => {
                    item.coordinate = JSON.parse(item.coordinate);
                    item.timer = JSON.parse(item.timer);
                    return item;
                })
                res.send({
                    status: 200,
                    data: result,
                    message: '查询成功',
                    total:coRes[0].total
                })
            })
        } else {
            res.send({
                status: 200,
                data: [],
                message: '查询成功',
                total:0
            })
        }
    })
})

router.post('/create/store', function (req, res) {
    const body = req.body;
    const sql = 'insert into stores_info set ?';
    db.query(sql, body, function (err, result) {
        if (err) return res.sendCallback(err.message);
        if (result.affectedRows !== 1) return res.sendCallback('新增失败', 400);
        res.send({
            status: 200,
            message: '新增成功'
        })
    })
})

router.post('/update/store', function (req, res) {
    const body = req.body;
    const sql = 'update stores_info set ? where id=?';
    console.log('body', body);
    db.query(sql, [body,body.id], function (err, result) {
        if (err) return res.sendCallback(err.message);
        if (result.affectedRows !== 1) return res.sendCallback('修改成功', 400);
        res.send({
            status: 200,
            message: '修改成功'
        })
    })
})

router.post('/delete/store', function (req, res) {
    const body = req.body;
    const sql = 'update stores_info set status=0 where id=?';
    db.query(sql, body.id, function (err, result) {
        if (err) return res.sendCallback(err.message);
        if (result.affectedRows !== 1) return res.sendCallback('删除失败', 400);
        res.send({
            status: 200,
            message: '删除成功'
        })
    })
})

module.exports = router;