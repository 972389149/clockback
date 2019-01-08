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
// 参数：id(信息id)、type(操作参数)、
router.get('/msgDealing', (req, res, next) => {
	// 1是拒绝，0是接受;数据库中 0是加入成功，1是拒绝加入
	msgDealing(req, res, next).then( (result) => {
		if(result == '0'){
			res.json({
				'status': '1',
				'msg': '接受成功',
				'result': result
			})
		}else{
			res.json({
				'status': '1',
				'msg': '拒绝成功',
				'result': result
			})
		}
	}, (err) => {
		res.json({
			'status': '-1',
			'msg': '操作失败！',
			'result': err
		})
	})
});

async function msgDealing(req, res, next){
	let promise_ = await PassivityMsg.findOne({
			'_id': mongoose.Types.ObjectId(req.query.id)
		}).exec();
	let updatePass = await new Promise( (resolve, reject) => {
		PassivityMsg.updateOne({
			'_id': mongoose.Types.ObjectId(req.query.id)
		},{
			$set:{
				'type': Number(req.query.type),
				'date': new Date
			}
		}, (err)=>{
			if(err){
				reject(err);
			}else{
				resolve();
			}
		})
	});
	let updateIni = await new Promise( (resolve, reject) => {
		InitiativeMsg.updateOne({
				'passivityMsgId': req.query.id
			},{
				$set:{
					'type': Number(req.query.type),
					'date': new Date
				}
			}, (err)=>{
				if(err){
					reject(err);
				}else{
					resolve();
				}
			})
	})
	if(req.query.type == '0'){
		let acceptPromise = await User.findOne({
			'_id': mongoose.Types.ObjectId(promise_.userId)
		}).exec();
		let updateDepart = await new Promise( (resolve, reject) => {
			let userMsg = {
				'userId': String(acceptPromise._id),
				'phone': acceptPromise.phone,
				'name': acceptPromise.name,
				'sex': acceptPromise.sex,
				'headImg': acceptPromise.headImg,
				'age': acceptPromise.age
			}
			Department.updateOne({
				'_id':  mongoose.Types.ObjectId(promise_.departmentId)
			},{
				$push: {'staffList': userMsg},
				$inc: {'quantity': 1}
			},(err)=>{
				if(err){
					reject(err);
				}else{
					resolve();
				}
				
			})
		});
		console.log(promise_.userId);
		let updateUser = await new Promise( (resolve, reject) => {
			let userdep = {
				'depdId': promise_.departmentId,
				'depdName': promise_.departmentName,
				'depdAdmin': promise_.administratorName
			}
			console.log(userdep);
			User.updateOne({
				'_id': mongoose.Types.ObjectId(promise_.userId)
			},{
				$push: {'dependence': userdep}
			}, (err)=>{
				if(err){
					reject(err);
				}else{
					resolve();
				}
			})
		})
		return '0';
	}else{
		return '1';
	}
}

// 用户删除消息接口
router.post('/deleteMsg', (req, res, next)=> {
	PassivityMsg.deleteOne({'_id': mongoose.Types.ObjectId(req.body.id)}, (err) => {
		if(err){
			res.json({
				'status': '-1',
				'msg': '删除异常',
				'result': err
			});
		}else{
			res.json({
				'status': '1',
				'msg': '删除成功',
				'result': ''
			});
		}
	})
})

module.exports = router;