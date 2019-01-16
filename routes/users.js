const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Department = require('../models/departments.js');
const User = require('../models/users.js');
const Administrator = require('../models/administrator.js');
const InitiativeMsg = require('../models/initiativeMsg.js');
const PassivityMsg = require('../models/passivityMsg.js');
const UserRecord = require('../models/userRecord.js');
const http = require('http');  
const request = require('request');
const qs = require('querystring');  

// 用户登录接口
router.get('/login', (req, res, next)=>{
	 login(req, res, next).then( (result) => {
	 	if(result == null){
	 		res.json({
		 		'status': '0',
		 		'msg': '尚未注册',
		 		'result': null
		 	})
	 	}else{
	 		res.json({
		 		'status': '1',
		 		'msg': '登录成功',
		 		'result': result
		 	})
	 	}
	 }, (err) => {
	 	res.json({
	 		'status': '-1',
	 		'msg': '登录失败',
	 		'result': ''
	 	})
	 })
})
async function login(req, res, next){
	let userId = await new Promise((resolve, reject) => {
		request.get({
	        uri: `https://api.weixin.qq.com/sns/jscode2session`,
	        json: true,
	        qs: {
	            grant_type: `authorization_code`,
	            appid: 'wxdf539abdfa024856',
	            secret: '7734ba38e4f8ba059722c96e70208ece',
	            js_code: req.query.code
	        }
	    }, (err, response, data) => {
	        if (response.statusCode === 200) {
	            resolve(data);
	        } else {
	            reject(err);
	        }
	    });
	})
	let users = await new Promise( (resolve, reject) => {
		if(userId.openid != undefined){
			User.findOne({'sessionId': userId.openid}, (err, doc) => {
				 if(err){
				 	reject(err);
				 }else if(doc == null){
				 	resolve(null);
				 }else{
				 	resolve(doc)
				 }
			})
		}else{
			reject();
		}
	})
	return users;
}

// 用户注册接口
router.get('/register', (req, res, next) => {
	register(req, res, next).then( (result) => {
		res.json({
			'status': '1',
			'msg': '注册成功',
			'result': result
		})
	}, (err) => {
		res.json({
			'status': '-1',
			'msg': '注册失败',
			'result': err
		})
	})
})
async function register (req, res, next){
	let openid = await new Promise((resolve, reject) => {
		request.get({
	        uri: `https://api.weixin.qq.com/sns/jscode2session`,
	        json: true,
	        qs: {
	            grant_type: `authorization_code`,
	            appid: 'wxdf539abdfa024856',
	            secret: '7734ba38e4f8ba059722c96e70208ece',
	            js_code: req.query.sessionId
	        }
	    }, (err, response, data) => {
	        if (response.statusCode === 200) {
	            resolve(data.openid);
	        } else {
	            reject(err);
	        }
	    });
	})
	let user = new Promise( (resolve, reject) => {
		// console.log(openid);
		if(openid != undefined){
			let user_ = new User({
				sessionId: openid,
				phone: req.query.phone,
				name: req.query.name,
				sex: req.query.sex,
				age: parseInt(req.query.age),
				headImg: req.query.headImg,
				nickName: req.query.nickName,
				dependence: new Array()
			});
			user_.save( (err, doc) => {
				if(err){
					reject(err);
				}else{
					// console.log(doc);
					resolve(doc._id);
				}
			})
		}else{
			reject();
		}

	})
	await new Promise((resolve, reject)=>{
		console.log(user);
		let userRecord = new UserRecord({
			userId: user,
			openid: openid,
			canClock: [],
			waitClock: [],
			hasClocked: [],
			absenceClocked: []
		})
		userRecord.save((err, doc)=>{
			if(err){
				reject()
			}else{
				resolve()
			}
		})
	})
	return user; 
}


// 搜索用户接口
// 参数：value
router.get('/searchUser',(req, res, next) => {
	if(req.query.value == ''){
		res.json({
			'status': '0',
			'msg': '参数不能为空',
			'result': ''
		})
	}else{
		if(req.query.type == '手机'){
			User.find({'phone': new RegExp(req.query.value)}, (err, doc) => {
				if(err){
					res.json({
						'status': '-1',
						'msg': '数据库检索异常',
						'result': ''
					});
				}else{
					if(doc.length == 0){
						res.json({
							'status': '1',
							'msg': '没有此用户',
							'result': doc
						});
					}else{
						res.json({
							'status': '1',
							'msg': '查询成功',
							'result': doc
						});
					}
				}
			});
		}else{
			User.find({'name': new RegExp(req.query.value)}, (err, doc)=> {
				if(err){
					res.json({
						'status': '-1',
						'msg': '数据库检索异常',
						'result': ''
					});
				}else{
					if(doc.length == 0){
						res.json({
							'status': '1',
							'msg': '没有此用户',
							'result': doc
						});
					}else{
						res.json({
							'status': '1',
							'msg': '查询成功',
							'result': doc
						});
					}
				}
			});
		}
	}
});

// 获取用户所在部门接口
// 参数： openid
router.get('/getGroup', (req, res, next) => {
	User.findOne({'sessionId': req.query.openid}, (err, doc)=>{
		if(err){
			res.json({
				'status': '-1',
				'msg': '获取部门列表失败',
				'result': err
			})
		}else{
			res.json({
				'status': '1',
				'msg': '获取部门列表成功',
				'result': doc.dependence
			})
		}
	})
})

// 获取部门详细信息接口
router.get('/getOneGroup', (req, res, next) => {
	Department.findOne({'_id': mongoose.Types.ObjectId(req.query.id)}, (err, doc) => {
		if(err){
			res.json({
				'status': '-1',
				'msg': '获取部门信息失败',
				'result': err
			})
		}else{
			res.json({
				'status': '1',
				'msg': '获取部门信息成功',
				'result': doc
			})
		}
	})
})


// 退出部门接口 参数：depdId、userId
router.get('/leaveGroup', (req, res, next) => {
	leaveGroup (req, res, next).then( (result) => {
		res.json({
			'status': '1',
			'msg': '退出部门成功',
			'result': result
		})
	},(err) => {
		res.json({
			'status': '-1',
			'msg': '退出部门异常',
			'result': err
		})
	})
});

async function leaveGroup (req, res, next){
	// 获取要退出部门的信息
	let promise1_ = await Department.findOne({'_id': mongoose.Types.ObjectId(req.query.depdId)}).exec();

	// 查询该用户的详细信息
	let promise2_ = await User.findOne({'_id': mongoose.Types.ObjectId(req.query.userId)}).exec();

	// 编辑主动信息
	let IMSG = {
		'passivityMsgId': null,
		'administratorId': promise1_.administrator.administratorId,
		'administratorName': promise1_.administrator.administratorName,
		'userId': String(promise2_._id),
		'userName': promise2_.name,
		'userPhone': promise2_.phone,
		'departmentId': promise1_._id,
		'departmentName': promise1_.name,
		'date': new Date,
		'type': 3
	}

	// 编辑被动信息
	let PMSG = {
		'initiativeMsgId': null,
		'administratorId': promise1_.administrator.administratorId,
		'administratorName': promise1_.administrator.administratorName,
		'userId': String(promise2_._id),
		'userName': promise2_.name,
		'userPhone': promise2_.phone,
		'departmentId': promise1_._id,
		'departmentName': promise1_.name,
		'date': new Date,
		'type': 2
	}

	// 更新User信息
	let user = await new Promise( (resolve, reject) => {
		User.updateOne({
				'_id': mongoose.Types.ObjectId(req.query.userId)
			},{
				 $pull: {'dependence': {'depdId':  req.query.depdId}}
			}, (err)=>{
				if(err){
					reject(err);
				}else{
					resolve();
				}
			});
	})

	// 更新部门信息
	let department = await new Promise( (resolve, reject) => {
		Department.updateOne({
			'_id': mongoose.Types.ObjectId(req.query.depdId)
		},{
			$inc: {quantity: -1},
			$pull: {'staffList': {'userId':  req.query.userId}}
		}, (err)=>{
			if(err){
				reject(err);
			}else{
				resolve();
			}
		});
	})

	// 发送主动信息
	let ini = await new Promise( (resolve, reject) => {
		let iniMsg = new InitiativeMsg(IMSG);
			iniMsg.save( (err,doc) => {
		        if(err){
		            reject(err);
		        }else{
		        	resolve(doc);
		        }
		    })
	})

	// 发送被动信息
	let pass = await new Promise( (resolve, reject) => {
		let pasMsg = new PassivityMsg(PMSG);
			pasMsg.save( (err,doc) => {
		        if(err){
		            reject(err);
		        }else{
		        	resolve(doc);
		        }
		    })
	})

	return 1;
}

module.exports = router;