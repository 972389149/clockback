const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Administrator = require('../models/administrator.js');
const InitiativeMsg = require('../models/initiativeMsg.js');
const PassivityMsg = require('../models/passivityMsg.js');
const Department = require('../models/departments.js');
const User = require('../models/users.js');
const svgCaptcha = require('svg-captcha');

/* Login */
/* 登录接口 */
/* 方法：post */
/* 参数：clockAccount、password */
router.post('/login', (req, res, next) => {
  if(req.body.clockAccount == '' || req.body.password == ''){
  	res.json({
  		'status': '0',
  		'msg': '参数不能为空',
  		'result': ''
  	});
  }else if(req.cookies.captcha != req.body.checkCode){
    res.json({
      'status': '-2',
      'msg': '验证码错误',
      'result': ''
    });
  }else{
  	let admin = {
  		'clockAccount': req.body.clockAccount,
  		'clockPassword': req.body.password
  	};
  	Administrator.findOne(admin, (err,doc)=>{
  		if(err){
  			res.json({
  				'status': '-1',
  				'msg': 'fail',
  				'result': ''
  			});
  		}else if(doc == null){
        res.json({
          'status': '0',
          'msg': '账号密码不正确',
          'result': ''
        });
  		}else{
        // cookie 一小时过期
        res.cookie('clockLogin',doc._id,{ httpOnly: true });
        res.cookie('captcha','',{ httpOnly: true });
        res.json({
          'status': '1',
          'msg': 'success',
          'result': {
            'name': doc.name,
            'clockAccount': doc.clockAccount,
            'phone': doc.phone,
            'sex': doc.sex, 
            'age': doc.age
          }
        });
      }
  	})
  }
});

/* checkCode */
/* 验证码接口 */
/* 方法：GET */
router.get('/checkCode',(req, res, next) => {
  var codeConfig = {
        size: 4,  //验证码长度
        background: "#f4f3f2",
        noise: 2, //干扰线条数
        ignoreChars: '0o1i',   //验证码字符中排除'0o1i'
        color: true, // 验证码的字符是否有颜色，默认没有，如果设定了背景，则默认有  
        height: 35,
        width: 111     
    }
    var captcha = svgCaptcha.create(codeConfig);
    res.cookie('clockLogin','',{ httpOnly: true });
    res.cookie('captcha',captcha.text.toLowerCase(),{httpOnly: true })//存cookie用于验证接口获取文字码
    res.json({
      'img':captcha.data
    });
});

/* LoginOut */
/* 登出接口 */
/* 方法：post */
/* 参数：status*/
router.post('/loginOut',(req, res, next) => {
  if(req.body.status != '1'){
    res.json({
      'status': '0',
      'msg': '参数错误,退出失败',
      'result': ''
    })
  }else{
    res.cookie('clockLogin','',{ httpOnly: true });
    res.json({
      'status': '1',
      'msg': '退出成功',
      'result': ''
    })
  }
})

/* register */
/* 注册接口 */
/* 方法：post */
/* 参数：clockName clockPhone clockAccout clockPassword clockPhonecheck*/
router.post('/register',(req, res, next) => {
  if(req.body.clockName == '' || req.body.clockAccount == '' || req.body.clockPassword == '' || req.body.clockPhone == ''){
    res.json({
      'status': '0',
      'msg': '参数不能空',
      'result': ''
    })
  }else{
    let registerDoc = new Administrator({
      clockAccount: req.body.clockAccount,
      clockPassword: req.body.clockPassword,
      phone: req.body.clockPhone,
      name: req.body.clockName,
      departmentList: []
    });
    registerDoc.save((err, doc) => {
      if(err){
        console.log(`注册异常`);
        res.json({
          'status': '-1',
          'msg': '注册异常',
          'result': ''
        })
      }else{
        res.cookie('clockLogin',doc._id,{httpOnly: true });
        res.json({
          'status': '1',
          'msg': '注册成功',
          'result': doc.name
        });
      }
    })
  }
})

/* register */
/* 手机验证码接口 */
/* 方法：post */
/* 参数：clockPhone*/
router.post('/phoneCheck',(req, res, next) => {
  if(req.body.clockPhone == ''){
    res.json({
      'status': '0',
      'msg': '参数不能为空',
      'result': ''
    })
  }else{
    Administrator.find({'phone': req.body.clockPhone},(err,doc) => {
      if(err){
        res.json({
          'status': '-1',
          'msg': '数据库检索异常',
          'result': ''
        })
        return;
      }
      console.log(`doc:${doc}`)
      if(doc == ''){
        res.json({
          'status': '1',
          'msg': '验证码已发送',
          'result': '1234'       //目前没钱用第三方的短信api，验证码用1234代替
        })
      }else{
        res.json({
          'status': '-2',
          'msg': '该手机号已经注册',
          'result': ''
        })
      }
    })
  }
})

/* getGroup */
/* 获取部门接口 */
/* 方法：get */
/* 参数：无*/
router.get('/getGroup',(req, res, next) => {
  if(req.cookies.clockLogin){
    let id = mongoose.Types.ObjectId(req.cookies.clockLogin); 
    Administrator.findOne({'_id': id}, (err,doc) => {
      if(err){
        res.json({
          'status': '-1',
          'msg': '数据库检索异常',
          'result': ''
        });
        return;
      };
      if(doc != ''){
        res.json({
          'status': '1',
          'msg': '获取成功',
          'result': [doc.departmentList,doc.name]
        });
      }else{
        res.json({
          'status': '0',
          'msg': '用户不存在',
          'result': ''
        });
      }
    })
  }else{
    res.json({
      'status': '-2',
      'msg': '未登录',
      'result': ''
    })
  }
});

/* inviteUser */
/* 邀请用户接口 */
/* 方法：post */
/* 参数：很多*/
router.post('/inviteUser', (req, res, next) => {
  inviteUser(req, res, next).then( (result)=>{
    console.log('邀请用户成功');
  }, (error)=>{
    res.json({
      'status': '0',
      'msg': 'Has invited!',
      'result': ''
    });
  });
});
async function inviteUser (req, res, next){
  if (req.cookies.clockLogin){

    // 检查是否邀请过该用户--同一个用户可以被不同部门邀请
    let check = await InitiativeMsg.findOne({'type': -1, 'userId': req.body.userId, 'departmentId': req.body.departmentId}).exec();
    console.log(check);
    if(check != null){
      return Promise.reject('Has invited!')
    }

    // 首先查询管理员的姓名
    let promise_ = await Administrator.findOne({'_id': mongoose.Types.ObjectId(req.cookies.clockLogin)}).exec();
    // 保存主动信息
    let inimsgResult = await saveIniMsgDoc(promise_, req, res);
    // 保存被动信息
    let passmsgResult = await savePassMsgDoc(inimsgResult, req, res);
    // 更新主动信息
    let result = await updateIniMsgDoc(passmsgResult, req, res);

    return result;
  }else{
    res.json({
      'status': '-2',
      'msg': '未登录',
      'result': ''
    });
  }
}
function saveIniMsgDoc (promise_, req, res){
      return new Promise((resolve, reject)=>{
          let iniMsgDoc = new InitiativeMsg({
          passivityMsgId: '',
          administratorId: req.cookies.clockLogin,
          administratorName: promise_.name,
          userId: req.body.userId,
          userName: req.body.userName,
          userPhone: req.body.userPhone,
          departmentId: req.body.departmentId,
          departmentName: req.body.departmentName,
          date: new Date,
          type: -1
        });
        iniMsgDoc.save( (err,doc) => {
          if(err){
            res.json({
                'status': '-1',
                'msg': '信息插入异常',
                'result': ''
              });
          };
          resolve({'administratorName': iniMsgDoc.administratorName,'initiativeMsgId': mongoose.Types.ObjectId(iniMsgDoc._id).toString()});
        });
      })
}
function savePassMsgDoc (inimsgResult, req, res){
    return new Promise((resolve, reject)=>{
      let passMsgDoc = new PassivityMsg({
        initiativeMsgId: inimsgResult.initiativeMsgId,
        administratorId: req.cookies.clockLogin,
        administratorName: inimsgResult.administratorName,
        userId: req.body.userId,
        userName: req.body.userName,
        userPhone: req.body.userPhone,
        departmentId: req.body.departmentId,
        departmentName: req.body.departmentName,
        date: new Date,
        type: -1
      });
      passMsgDoc.save( (err,doc) => {
        if(err){
          res.json({
            'status': '-1',
            'msg': '信息插入异常',
            'result': ''
          })
        }
        resolve({'passMsgDocId': mongoose.Types.ObjectId(passMsgDoc._id).toString(),'initiativeMsgId': inimsgResult.initiativeMsgId});
      });
    })
}
function updateIniMsgDoc (passmsgResult, req, res){
    return new Promise((resolve, reject)=>{
      InitiativeMsg.updateOne({
        '_id': mongoose.Types.ObjectId(passmsgResult.initiativeMsgId)
      }, {
        $set: {'passivityMsgId': passmsgResult.passMsgDocId}
      }, (err) => {
        if(err){
          res.json({
              'status': '-1',
              'msg': '信息插入异常',
              'result': ''
            });
        }else{
          res.json({
              'status': '1',
              'msg': '邀请成功',
              'result': ''
            });
        }
        resolve('ok');
      })
    })
}


/* cancelInvite */
/* 取消邀请用户接口 */
/* 方法：post */
/* 参数：很多*/
router.post('/cancelInvite', (req, res, next) => {
  if(req.cookies.clockLogin){
    cancelInvite (req, res, next).then((result)=>{
      res.json({
        'status': '1',
        'msg': '取消邀请成功',
        'result': ''
      });
    },(error)=>{
      res.json({
        'status': '-1',
        'msg': '取消邀请异常',
        'result': ''
      });
    })
  }else{
    res.json({
      'status': '0',
      'msg': '未登录',
      'result': ''
    });
  }
});
async function cancelInvite(req, res, next){
  let promise = await InitiativeMsg.findOne({'_id': mongoose.Types.ObjectId(req.body.id)}).exec();
  let updateIni = await new Promise((resolve, reject)=>{
    InitiativeMsg.updateOne({
        '_id': mongoose.Types.ObjectId(req.body.id)
      },{
        'type': 2
      }, (err) => {
        if(err){
          res.json({
            'status': '-1',
            'msg': '取消邀请失败',
            'result': ''
          });
        }
      });
    resolve();
  })
  let updatePass = await new Promise((resolve, reject)=>{
    PassivityMsg.deleteOne({'_id': mongoose.Types.ObjectId(req.body.passivityMsgId)}, (err) => {
        if(err){
          res.json({
            'status': '-1',
            'msg': '取消邀请异常',
            'result': ''
          });
        }
      });
    resolve();
  })
  return 1;
}

/* getAdmin */
/* 获取管理员信息 */
/* 方法：Get */
/* 参数：无*/
router.get('/getAdmin', (req, res, next) => {
  if(req.cookies.clockLogin){
    Administrator.findOne({'_id': mongoose.Types.ObjectId(req.cookies.clockLogin)}, (err,doc)=>{
      if (err){
        res.json({
          'status': '0',
          'msg': '数据库检索异常',
          'result': ''
        })
      }else{
        if(doc == ''){
          res.json({
            'status': '0',
            'msg': '不存在此管理员',
            'result': ''
          })
        }else{
          res.json({
            'status': '1',
            'msg': '获取成功',
            'result': doc
          })
        }
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

/* editAdmin */
/* 修改管理员信息 */
/* 方法：post */
/* 参数：无*/
router.post('/editAdmin', (req, res, next)=> {
  if(req.cookies.clockLogin){
    Administrator.updateOne({
      '_id': mongoose.Types.ObjectId(req.cookies.clockLogin)
    },{
      $set: {
        clockAccount: req.body.clockAccount,
        name: req.body.name,
        clockPassword: req.body.clockPassword,
        phone: req.body.phone
      }
    }, (err,doc)=>{
      if (err){
        res.json({
          'status': '0',
          'msg': '数据更新异常',
          'result': ''
        })
      }else{
        if(doc == ''){
          res.json({
            'status': '0',
            'msg': '不存在此管理员',
            'result': ''
          })
        }else{
          res.json({
            'status': '1',
            'msg': '更新成功',
            'result': doc
          })
        }
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

// 部门删除成员接口，参数 depdId,userId
router.post('/leaveGroup', (req, res, next) => {
  leaveGroup (req, res, next).then( (result) => {
    res.json({
      'status': '1',
      'msg': '删除成功',
      'result': result
    })
  },(err) => {
    res.json({
      'status': '-1',
      'msg': '删除失败',
      'result': err
    })
  })
});

async function leaveGroup (req, res, next){
  // 获取要退出部门的信息
  let promise1_ = await Department.findOne({'_id': mongoose.Types.ObjectId(req.body.depdId)}).exec();
  // 查询该用户的详细信息
  let promise2_ = await User.findOne({'_id': mongoose.Types.ObjectId(req.body.userId)}).exec();
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
    'type': 4
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
    'type': 3
  }

  // 更新User信息
  let user = await new Promise( (resolve, reject) => {
    User.updateOne({
        '_id': mongoose.Types.ObjectId(req.body.userId)
      },{
         $pull: {'dependence': {'depdId':  req.body.depdId}}
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
      '_id': mongoose.Types.ObjectId(req.body.depdId)
    },{
      $inc: {quantity: -1},
      $pull: {'staffList': {'userId':  req.body.userId}}
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