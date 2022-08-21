const express = require('express');
const db = require('../db');

const router = express.Router();

router.get('/query', function (req, res) {
    const sql = 'select id,name,address,city,timer,iphone,gd_coordinate,bd_coordinate  from info_table where status!=0';
    db.query(sql, function (err, result) {
        if (err) return res.sendCallback(err.message);
        result = result.map(item => {
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
