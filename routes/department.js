const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Department = require('../models/departments.js');
const Administrator = require('../models/administrator.js');

/* getOneGroup */
/* 获取部门信息接口 */
/* 方法：get */
/* 参数：id */
router.get('/getOneGroup', (req, res, next) => {
	if(req.query.id == ''){
		res.json({
			'status': '0',
			'msg': '参数不能为空',
			'result': ''
		});
	}else{
		let id_ = mongoose.Types.ObjectId(req.query.id);
		Department.findOne({'_id': id_}, (err,doc) => {
			if(err){
				res.json({
					'status': '-1',
					'msg': '数据库检索失败',
					'result': ''
				})
				return;
			}
			if(doc == ''){
				res.json({
					'status': '-2',
					'msg': '不存在此部门',
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
	}
})

/* addGroup */
/* 添加部门接口 */
/* 方法：post */
router.post('/addGroup', (req, res, next)=> {
	let id_ = mongoose.Types.ObjectId(req.cookies.clockLogin);
	let groupId = '';
	let promise = Administrator.findOne({'_id': id_}).exec();
    promise.then( (result) => {
        let groupDoc = new Department({
        	name: req.body.name,
        	administrator:{
        		administratorName: result.name,
        		administratorPhone: result.phone,
        		administratorId: mongoose.Types.ObjectId(result._id).toString()
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
		        res.json({
		          'status': '-1',
		          'msg': '添加部门异常',
		          'result': ''
		        })
		    }else{
		        
		    }
        })
        return {'deptId': mongoose.Types.ObjectId(groupDoc._id).toString(),'deptName': req.body.name,'quantity': 0};
      },
      (err) => {
      	res.json({
        	'status': '0',
		    'msg': '添加失败',
		    'result': ''
        })
      }
    ).then( (data) => {
    	Administrator.update({'_id': id_},{"$push":{"departmentList": data}}, (err) => {
    		if(err){
    			res.json({
		        	'status': '0',
				    'msg': '添加失败',
				    'result': ''
		        })
    		}else{
    			res.json({
		          'status': '1',
		          'msg': '添加成功',
		          'result': ''
		        });
    		}
    	})
    }, (err) => {
    	res.json({
        	'status': '0',
		    'msg': '添加失败',
		    'result': ''
        });
    });
})

/* delGroup */
/* 删除部门接口 */
/* 方法：post */
/* 参数：id */
router.post('/deleteGroup', (req, res, next) => {
	if(req.body.id == ''){
		res.json({
          'status': '0',
          'msg': '参数不能为空',
          'result': ''
        });
	}else{
		let promise = Department.findOne({'_id': mongoose.Types.ObjectId(req.body.id)}).exec();
		promise.then( (result) => {
			// 这里可以优化，直接从cookie拿用户id，不用从数据库拿
			let conditions = {'_id':  mongoose.Types.ObjectId(result.administrator.administratorId)};
			let updates = {'$pull':{'departmentList': {'deptId': req.body.id}}};
			Administrator.update(conditions, updates, (err) => {
				if(err){
					res.json({
			        	'status': '-1',
					    'msg': '删除失败',
					    'result': ''
			        });
				}
			})
		}, (err) => {
			res.json({
	        	'status': '-1',
			    'msg': '删除失败',
			    'result': ''
	        });
		}).then( (result) => {
			Department.remove({'_id': mongoose.Types.ObjectId(req.body.id)}, (err) => {
				if(err){
					res.json({
			        	'status': '-1',
					    'msg': '删除失败',
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
		}, (err) => {
			res.json({
	        	'status': '-1',
			    'msg': '删除失败',
			    'result': ''
	        });
		})
	}
});

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
	          res.json({
	              'status': '-1',
	              'msg': '编辑异常',
	              'result': ''
	            });
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
	          res.json({
	              'status': '-1',
	              'msg': '编辑异常',
	              'result': ''
	            });
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
	if(req.query.id == ''){
		res.json({
			'status': '0',
			'msg': '参数不能为空',
			'result': ''
		});
	}else{
		let id_ = mongoose.Types.ObjectId(req.query.id);
		Department.findOne({'_id': id_}, (err,doc) => {
			if(err){
				res.json({
					'status': '-1',
					'msg': '数据库检索失败',
					'result': ''
				})
				return;
			}
			if(doc == ''){
				res.json({
					'status': '-2',
					'msg': '不存在此部门',
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