const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const UserRecord = require('../models/userRecord.js');

/* 用户获取可打卡信息接口. */
/* 参数 userId. */
router.get('/getCanClock', (req, res, next)=>{
	UserRecord.findOne({'userId': req.query.userId}, (err, doc)=>{
		if(err){
			res.json({
				'status': '-1',
				'msg': '获取信息失败',
				'result': err
			})
		}else{
			res.json({
				'status': '1',
				'msg': '获取成功',
				'result': doc.canClock
			})
		}
	})
})

/* 用户获取待打卡信息接口. */
/* 参数 userId. */
router.get('/getWaitClock', (req, res, next)=>{
	UserRecord.findOne({'userId': req.query.userId}, (err, doc)=>{
		if(err){
			res.json({
				'status': '-1',
				'msg': '获取信息失败',
				'result': err
			})
		}else{
			res.json({
				'status': '1',
				'msg': '获取成功',
				'result': doc.waitClock
			})
		}
	})
})

/* 用户获取已打卡信息接口. */
/* 参数 userId. */
router.get('/getHasClocked', (req, res, next)=>{
	UserRecord.findOne({'userId': req.query.userId}, (err, doc)=>{
		if(err){
			res.json({
				'status': '-1',
				'msg': '获取信息失败',
				'result': err
			})
		}else{
			res.json({
				'status': '1',
				'msg': '获取成功',
				'result': doc.hasClocked
			})
		}
	})
})

/* 用户获取缺勤信息接口. */
/* 参数 userId. */
router.get('/getAbsenceClocked', (req, res, next)=>{
	UserRecord.findOne({'userId': req.query.userId}, (err, doc)=>{
		if(err){
			res.json({
				'status': '-1',
				'msg': '获取信息失败',
				'result': err
			})
		}else{
			res.json({
				'status': '1',
				'msg': '获取成功',
				'result': doc.absenceClocked
			})
		}
	})
})

module.exports = router;
