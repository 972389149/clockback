const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Department = require('../models/departments.js');
const User = require('../models/users.js');
const Administrator = require('../models/administrator.js');
const InitiativeMsg = require('../models/initiativeMsg.js');
const PassivityMsg = require('../models/passivityMsg.js');
const http = require('http');  
const qs = require('querystring');  

// 用户登录接口
router.get('/login', (req, res, next)=>{
	console.log(req.query.code);
	let data = {
		appid: 'wxdf539abdfa024856',
		secret: '35bf9310a2910ca0f2e1c49e39be8828',
		js_code: req.query.code,
		grant_type: 'authorization_code'
	}
	let content = qs.stringify(data);  
  	console.log(content);
	let options = {  
	    hostname: 'https://api.weixin.qq.com/sns/jscode2session' 
	    path: '/sns/jscode2session?' + content,  
	    method: 'GET'  
	};

	let req_ = http.request(options, function (res_) {  
	    console.log('STATUS: ' + res_.statusCode);  
	    console.log('HEADERS: ' + JSON.stringify(res_.headers));  
	    res_.setEncoding('utf8');  
	    res_.on('data', function (chunk) {  
	        console.log('BODY: ' + chunk);  
	    });  
	});  
  
	req_.on('error', function (e) {  
	    console.log('problem with request: ' + e.message);  
	}); 

	res.json({
		'status': '1'
	})
})

// 搜索用户接口
router.get('/searchUser',(req, res, next) => {
	if(req.query.value == ''){
		res.json({
			'status': '0',
			'msg': '参数不能为空',
			'result': ''
		})
	}else{
		if(req.query.type == '手机'){
			User.find({'phone': new RegExp(req.query.value)}, (err, doc)=> {
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

// 退出部门接口 参数：depdId、userId
// 头脑风暴的接口
router.get('/leaveGroup', (req, res, next) => {
	let promise1 = Department.findOne({
		'_id': mongoose.Types.ObjectId(req.query.depdId)
	}).exec();
	promise1.then( (result) => {
		// console.log(`First val:${JSON.stringify(result)}`);
		Department.updateOne({
			'_id': mongoose.Types.ObjectId(req.query.depdId)
		},{
			$inc: {quantity: -1},
			$pull: {'staffList': {'userId':  req.query.userId}}
		}, (err)=>{
			if(err){
				res.json({
					'status': '0',
					'msg': err,
					'result': ''
				})
			}
		});
		return result;
	}).then( (result) => {
		// console.log(`Second val:${JSON.stringify(result)}`);
		let promise2 = User.findOne({
			'_id': mongoose.Types.ObjectId(req.query.userId)
		}).exec();
		promise2.then( (val)=>{
			// console.log(`Third val:${JSON.stringify(val)}`);
			User.updateOne({
				'_id': mongoose.Types.ObjectId(req.query.userId)
			},{
				 $pull: {'dependence': {'depdId':  req.query.depdId}}
			}, (err)=>{
				if(err){
					res.json({
						'status': '0',
						'msg': err,
						'result': ''
					})
				}
			});
			let IMSG = {
				'passivityMsgId': '',
				'administratorId': result.administrator.administratorId,
				'administratorName': result.administrator.administratorName,
				'userId': String(val._id),
				'userName': val.name,
				'userPhone': val.phone,
				'departmentId': result._id,
				'departmentName': result.name,
				'date': new Date,
				'type': 3
			}
			let PMSG = {
				'initiativeMsgId': '',
				'administratorId': result.administrator.administratorId,
				'administratorName': result.administrator.administratorName,
				'userId': String(val._id),
				'userName': val.name,
				'userPhone': val.phone,
				'departmentId': result._id,
				'departmentName': result.name,
				'date': new Date,
				'type': 2
			}
			let obj = {'initiativeMsg': IMSG, 'passivityMsg': PMSG};
			return obj;
		}).then( (val)=>{
			let obj1 = val;
			// console.log(`Four val:${JSON.stringify(val)}`);
			let msgPromise = Department.find({
				'_id': mongoose.Types.ObjectId(req.query.depdId)
			}).exec();
			msgPromise.then( (val)=>{
				let iniMsg = new InitiativeMsg(obj1.initiativeMsg);
				iniMsg.save( (err,doc) => {
			        if(err){
			          res.json({
			              'status': '-1',
			              'msg': '退出失败',
			              'result': ''
			            });
			        };
			      });
				obj1.passivityMsg.initiativeMsgId = iniMsg._id;
				return obj1;
			}).then( (val)=>{
				let pasMsg = new PassivityMsg(val.passivityMsg);
				pasMsg.save( (err,doc) => {
			        if(err){
			          res.json({
			              'status': '-1',
			              'msg': '退出失败',
			              'result': ''
			            });
			        }else{
			        	InitiativeMsg.updateOne({
			        		'_id': mongoose.Types.ObjectId(val.passivityMsg.initiativeMsgId)
			        	},{
			        		$set: {'passivityMsgId': mongoose.Types.ObjectId(doc._id).toString()}
			        	},(err) => {
			              if(err){
			                res.json({
			                    'status': '-1',
			                    'msg': '信息插入异常',
			                    'result': ''
			                  });
			              }else{
			                res.json({
			                    'status': '1',
			                    'msg': '退出成功',
			                    'result': ''
			                  });
			              }
	            		})
			        };
			    });
			})
		})
	})
});

module.exports = router;