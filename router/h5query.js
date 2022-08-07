const express = require('express');
const db = require('../db');

const router = express.Router();

router.get('/query', function (req, res) {
    const {
        name = '',
        city = ''
    } = req.query;
    const condition = `${name ? `and name="${name}"` : ''} ${city ? `and city="${city}"` : ''}`
    const sql = `select id,name,address,city,timer,ipone,coordinate  from stores_info where status!=0 ${condition} limit 1,8`;
    db.query(sql, function (err, result) {
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
        })
    })
})


module.exports = router;