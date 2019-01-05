const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Department = require('../models/departments.js');
const User = require('../models/users.js');
const Administrator =require('../models/administrator.js');
const PassivityMsg = require('../models/passivityMsg.js');
const InitiativeMsg =require('../models/initiativeMsg.js');

router.get('/getMsg', (req, res, next) => {
	if(req.cookies.clockLogin){
		InitiativeMsg.find({'administratorId': req.cookies.clockLogin}, (err,doc) => {
			if(err){
				res.json({
					'status': '-1',
					'msg': '数据库检索异常',
					'result': ''
				})
			}else{
				res.json({
					'status': '1',
					'msg': '成功',
					'result': doc
				})
			}
		})
	}else{
		res.json({
			'status': '-1',
			'msg': '请先登录',
			'result': ''
		})
	}
});

router.post('/deleteMsg', (req, res, next) => {
	if(req.body.id == ''){
		res.json({
			'status': '0',
			'msg': '参数不能为空',
			'result': ''
		});
	}else{
		InitiativeMsg.deleteOne({'_id': mongoose.Types.ObjectId(req.body.id)}, (err) => {
			if(err){
				res.json({
					'status': '-1',
					'msg': '数据库检索异常',
					'result': ''
				});
			}else{
				res.json({
					'status': '1',
					'msg': '删除成功',
					'result': ''
				});
			}
		})
	}
})

module.exports = router;