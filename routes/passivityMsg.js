const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Department = require('../models/departments.js');
const User = require('../models/users.js');
const Administrator = require('../models/administrator.js');
const InitiativeMsg = require('../models/initiativeMsg.js');
const PassivityMsg = require('../models/passivityMsg.js');

// 用户获取系信息接口
router.get('/getMsg', (req, res, next) => {
	if(req.body.id == ''){
		res.json({
			'status': '0',
			'msg': '参数不能为空',
			'result': ''
		});
	}else{
		PassivityMsg.find({'userId': req.query.id}, (err, doc) => {
			if(err){
				res.json({
					'status': '-1',
					'msg': '数据库检索异常',
					'result': ''
				});
			}else{
				res.json({
					'status': '1',
					'msg': '查询成功',
					'result': doc
				});
			}
		})
	}
});

// 获取具体某条消息
router.get('/msgDetail', (req, res, next) => {
	if(req.query.id == ''){
		res.json({
			'status': '-1',
			'msg': '参数不能为',
			'result': ''
		})
	}else{
		PassivityMsg.findOne({'_id': mongoose.Types.ObjectId(req.query.id)}, (err,doc)=>{
			if(err){
				res.json({
					'status': '0',
					'msg': '数据库检索异常',
					'result': ''
				})
			}else{
				res.json({
					'status': '1',
					'msg': '查询成功',
					'result': doc
				})
			}
		})
	}
})

// 用户接受或者拒绝申请
router.get('/msgDealing', (req, res, next) => {
	// 1是拒绝，0是接受;数据库中 0是加入成功，1是拒绝加入
	let type = ['0','1'];
	if(type.includes(req.query.type)){
		let promise = PassivityMsg.findOne({
			'_id': mongoose.Types.ObjectId(req.query.id)
		}).exec();
		promise.then( (result)=>{
			PassivityMsg.updateOne({
				'_id': mongoose.Types.ObjectId(req.query.id)
			},{
				$set:{
					'type': Number(req.query.type),
					'date': new Date
				}
			}, (err)=>{
				if(err){
					res.json({
						'status': '0',
						'msg': err,
						'result': ''
					})
				}
			})
			// console.log(`第一个result：${result}`);
			let msg = {'userId': result.userId, 'departmentId': result.departmentId,'depdName':result.departmentName,'depdAdmin':result.administratorName}
			return msg;
		}).then( (result)=>{
			InitiativeMsg.updateOne({
				'passivityMsgId': req.query.id
			},{
				$set:{
					'type': Number(req.query.type),
					'date': new Date
				}
			}, (err)=>{
				if(err){
					res.json({
						'status': '0',
						'msg': err,
						'result': ''
					})
				}else{
					if(req.query.type == '0'){
						let newVal = result;
						let acceptPromise = User.findOne({
							'_id': mongoose.Types.ObjectId(newVal.userId)
						}).exec();
						acceptPromise.then( (val)=>{
							let userMsg = {
								'userId': String(val._id),
								'phone': val.phone,
								'name': val.name,
								'sex': val.sex,
								'headImg': val.headImg,
								'age': val.age
							}
							Department.updateOne({
								'_id':  mongoose.Types.ObjectId(newVal.departmentId)
							},{
								$push: {'staffList': userMsg},
								$inc: {quantity: 1}
							},(err)=>{
								if(err){
									res.json({
							        	'status': '0',
									    'msg': '同意失败',
									    'result': ''
							        })
								}
							})
						}).then( (val)=>{
							let userdep = {
								'depdId': newVal.departmentId,
								'depdName': newVal.depdName,
								'depdAdmin': newVal.depdAdmin
							}
							User.updateOne({
								'_id': mongoose.Types.ObjectId(newVal.userId)
							},{
								$push: {'dependence': userdep}
							}, (err)=>{
								if(err){
									res.json({
							        	'status': '0',
									    'msg': '同意失败',
									    'result': ''
							        })
								}else{
									res.json({
							        	'status': '1',
									    'msg': '同意成功',
									    'result': ''
							        })
								}
							})
						})
					}else{
						res.json({
							'status': '1',
							'msg': '拒绝成功',
							'result': ''
						})
					}
				}
			})
		})
	}else{
		res.json({
			'status': '-1',
			'msg': '参数错误',
			'result': ''
		})
	}
});

// 用户删除消息接口
router.post('/deleteMsg', (req, res, next)=> {
	if(req.body.id){
		PassivityMsg.deleteOne({'_id': mongoose.Types.ObjectId(req.body.id)}, (err) => {
			if(err){
				res.json({
					'status': '0',
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
	}else{
		res.json({
			'status': '-1',
			'msg': '参数错误',
			'result': ''
		})
	}
})

module.exports = router;