const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Department = require('../models/departments.js');
const Administrator = require('../models/administrator.js');
const DepartmentRecord = require('../models/departmentRecord.js');
const User = require('../models/users.js');

/* getOneGroup */
/* 获取部门信息接口 */
/* 方法：get */
/* 参数：id */
router.get('/getOneGroup', (req, res, next) => {
	if(!req.cookies.clockLogin){
		res.json({
			'status': '0',
			'msg': '请先登录',
			'result': ''
		});
	}else{
		Department.findOne({'_id': mongoose.Types.ObjectId(req.query.id)}, (err,doc) => {
			if(err){
				res.json({
					'status': '-1',
					'msg': '获取失败',
					'result': ''
				})
			}else{
				res.json({
					'status': '1',
					'msg': '获取成功',
					'result': doc
				})
			}
		})
	}
})

/* addGroup */
/* 添加部门接口 */
/* 方法：post */
router.post('/addGroup', (req, res, next)=> {
	if(req.cookies.clockLogin){
		addGroup(req, res, next).then((result)=>{
			res.json({
	          'status': '1',
	          'msg': '添加成功',
	          'result': ''
	        });
		},(error)=>{
			res.json({
	          'status': '-1',
	          'msg': '添加失败',
	          'result': ''
	        });
		}).catch((err)=>{
			res.json({
	          'status': '-1',
	          'msg': '添加错误',
	          'result': ''
	        });
		})
	}else{
		res.json({
			'status': '0',
			'msg': '请先登录',
			'result': ''
		})
	}
})

async function addGroup(req, res, next){
	let promise_ = await Administrator.findOne({'_id': mongoose.Types.ObjectId(req.cookies.clockLogin)}).exec();
	let saveGroup = await new Promise((resolve, reject)=>{
		let groupDoc = new Department({
        	name: req.body.name,
        	administrator:{
        		administratorName: promise_.name,
        		administratorPhone: promise_.phone,
        		administratorId: mongoose.Types.ObjectId(promise_._id).toString()
        	},
        	clockDate: req.body.clockDate,
        	clockDayTimes: req.body.clockDayTimes,
        	clockList: req.body.clockList,
        	quantity: req.body.quantity,
        	staffList: req.body.staffList,
        	address: req.body.address
        });
        groupDoc.save( (err, doc) => {
        	if(err){
		        reject(err);
		    }
		    resolve({'deptId': mongoose.Types.ObjectId(groupDoc._id).toString(),'deptName': req.body.name,'quantity': 0});
        })
	})
	let updateAdmin = await new Promise((resolve, reject)=>{
		Administrator.update({'_id': mongoose.Types.ObjectId(req.cookies.clockLogin)},{"$push":{"departmentList": saveGroup}}, (err) => {
    		if(err){
    			reject();
    		}else{
    			resolve();
    		}
    	})
	})
	let saveRecord = await new Promise((resolve, reject)=>{
		let groupRecord = new DepartmentRecord({
			deptId: saveGroup.deptId,
			adminId: mongoose.Types.ObjectId(promise_._id).toString(),
			hasClocked: [],
			noClocked: []
		})
		groupRecord.save((err, doc)=>{
			if(err){
				reject(err);
			}else{
				resolve(groupRecord);
			}
		})
	})
	return 1;
}

/* delGroup */
/* 删除部门接口 */
/* 方法：post */
/* 参数：id */
router.post('/deleteGroup', (req, res, next) => {
	if(req.cookies.clockLogin){
		deleteGroup(req, res, next).then((result)=>{
			res.json({
				'status': '1',
				'msg': '删除成功',
				'result': ''
			})
		},(err)=>{
			res.json({
				'status': '-1',
				'msg': '删除失败',
				'result': ''
			})
		})
	}else{
		res.json({
			'status': '0',
			'msg': '请先登录',
			'result': ''
		})
	}
});

async function deleteGroup(req, res, next){
	await new Promise((resolve, reject)=>{
		let conditions = {'_id':  mongoose.Types.ObjectId(req.cookies.clockLogin)};
		let updates = {'$pull':{'departmentList': {'deptId': req.body.id}}};
		Administrator.updateOne(conditions, updates, (err) => {
			if(err){
				reject();
			}else{
				resolve();
			}
		})
	});
	await new Promise((resolve, reject)=>{
		Department.remove({'_id': mongoose.Types.ObjectId(req.body.id)}, (err) => {
			if(err){
				reject();
			}else{
				resolve();
			}
		})
	});
	await new Promise((resolve, reject)=>{
		DepartmentRecord.remove({'deptId': req.body.id}, (err) => {
			if(err){
				reject();
			}else{
				resolve();
			}
		})
	})
	return 1;
}

/* editGroup */
/* 编辑部门接口 */
/* 方法：post */
router.post('/editGroup', (req, res, next)=>{
	if(req.cookies.clockLogin){
		edit(req, res, next).then((resulr)=>{
			res.json({
              'status': '1',
              'msg': '编辑成功',
              'result': ''
            });
		}, (err)=>{
			res.json({
              'status': '-1',
              'msg': '编辑异常',
              'result': err
            });
		})
	}else{
		res.json({
			'status': 0,
			'msg': '请先登录',
			'result': ''
		})
	}
})
async function edit(req, res, next){
	console.log(`部门id:${req.body.id}`);
	let result1 = await new Promise((resolve, reject)=>{
		Administrator.updateOne({
			 "departmentList.deptId":  req.body.id
		},{
			$set: {'departmentList.$.deptName': req.body.name}
		},(err)=>{
			if(err){
	          reject(err);
	        }
	        resolve();
		})
	})
	let result2 = await new Promise((resolve, reject)=>{
		Department.updateOne({
	        '_id': mongoose.Types.ObjectId(req.body.id)
	      }, {
	        $set: {'name': req.body.name,
	        		'clockDate': req.body.clockDate,
	        		'clockList': req.body.clockList,
	        		'address': req.body.address
	    		}
	      }, (err) => {
	        if(err){
	          reject(err);
	        }
	        resolve();
	      })
	})

	let result3 = await new Promise((resolve, reject)=>{
		User.update({
			'dependence.depdId':  req.body.id
		},{
			$set: {
				'dependence.$.deptName': req.body.name
			}	
		}, (err)=>{
			if(err){
				reject(err);
			}
			resolve();
		})
	})
	return 1;
}


/* getStaffList */
/* 获取员工列表接口 */
/* 方法：get */
/* 参数：id */
router.get('/getStaffList', (req, res, next) => {
	if(!req.cookies.clockLogin){
		res.json({
			'status': '0',
			'msg': '请先登录',
			'result': ''
		});
	}else{
		Department.findOne({'_id': mongoose.Types.ObjectId(req.query.id)}, (err,doc) => {
			if(err){
				res.json({
					'status': '-1',
					'msg': '获取员工列表失败',
					'result': ''
				})
			}else{
				res.json({
					'status': '1',
					'msg': '成功',
					'result': doc.staffList
				})
			}
		})
	}
})

module.exports = router;