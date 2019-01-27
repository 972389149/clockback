const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const DepartmentRecord = require('../models/departmentRecord.js');
const UserRecord = require('../models/userRecord.js');

/* GET home page. */
router.get('/hasClocked', function(req, res, next) {
	DepartmentRecord.findOne({
		'deptId': req.query.id
	}, (err, doc)=>{
		if(err){
			res.json({
				'status': '-1',
				'msg': '查询失败',
				'result': err
			})
		}else{
			console.log(`查找到${doc.hasClocked}`);
			res.json({
				'status': '1',
				'msg': '查询成功',
				'result': doc.hasClocked
			})
		}
	})
});

router.get('/noClocked', function(req, res, next) {
	DepartmentRecord.find({
		'deptId': req.query.id
	}, (err, doc)=>{
		if(err){
			res.json({
				'status': '-1',
				'msg': '查询失败',
				'result': err
			})
		}else{
			console.log(`查找到${doc.noClocked}`);
			res.json({
				'status': '1',
				'msg': '查询成功',
				'result': doc.noClocked
			})
		}
	})
});

router.get('/userHistory', function(req, res, next) {
	console.log(`${req.query.userId}+++:+++${req.query.depdId}`)
	UserRecord.findOne({
		'userId': req.query.userId
	}, (err, doc)=>{
		if(err){
			res.json({
				'status': '-1',
				'msg': '查询失败',
				'result': err
			})
		}else{
			let arr = [];
			for(let i=0;i<doc.hasClocked.length;i++){
				if(doc.hasClocked[i].deptId == req.query.depdId){
					let obj = doc.hasClocked[i];
					let arr_ = obj.clockTime.split(':');
					if(arr_[1].length != 2){
						arr_[1] = '0' + arr_[1];
					}
					obj.clockTime = arr_[0] + ':' + arr_[1];
					arr.push(obj);
				}
			}
			res.json({
				'status': '1',
				'msg': '查询成功',
				'result': arr
			})
		}
	})
});

module.exports = router;
