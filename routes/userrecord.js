const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const UserRecord = require('../models/userRecord.js');
const Department = require('../models/departments.js');

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

/* 用户打卡接口. */
/* 参数 id，userId，deptId，adminId，clockStart，clockEnd，clockDate，clockTime，address，clockAddress. */
router.get('/clock', (req, res, next)=>{
	clock(req, res, next).then((result)=>{
		res.json({
			'status': '1',
			'msg': '打卡成功',
			'result': result
		})
	}, (err)=>{
		res.json({
			'status': '-1',
			'msg': '打卡失败',
			'result': err
		})
	})
})
async function clock(req, res, next){
	// 添加到 用户打卡记录
	await new Promise((resolve, reject)=>{
		let content = {
			'deptId': req.query.deptId,
	 		'adminId': req.query.adminId,
	 		'clockStart': req.query.clockStart,
	 		'clockEnd': req.query.clockEnd,
	 		'clockDate': req.query.clockDate,
	 	 	'clockTime': req.query.clockTime,
	 		'address': req.query.address,
	 	 	'clockAddress': req.query.clockAddress
		}
		UserRecord.updateOne({
		  '_id': mongoose.Types.ObjectId(req.query.id),
          'userId': req.query.userId
        }, {
          "$push":{"hasClocked": content}
        }, (err)=>{
          if(err){
            reject(err);
          }else{
            resolve();
          }
        })
	})

	// 从 可打卡中移除
	await new Promise((resolve, reject)=>{
		UserRecord.updateOne({
	        'userId': req.query.userId
	      }, {
	        "$pull": {'canClock': {'deptId': req.query.deptId}}
	      }, (err)=>{
	        if(err){
	          reject(err);
	        }else{
	          resolve();
	        }
	      })
	})

	// 添加到 部门的打卡记录
	await new Promise((resolve, reject)=>{
		let content = {
            'userId': req.query.userId,
	 		'clockDate': req.query.clockDate,
	 		'clockStart': req.query.clockStart,
	 		'clockEnd': req.query.clockEnd,
	 		'clockTime': req.query.clockTime,
	 		'clockAddress': req.query.clockAddress
        }
        DepartmentRecord.updateOne({
          'deptId': req.query.deptId
        }, {
          "$push":{"hasClocked": content}
        }, (err)=>{
          if(err){
            reject(err);
          }else{
            resolve();
          }
        })
	})

	return 1;
}

module.exports = router;
