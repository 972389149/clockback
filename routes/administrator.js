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
  if(req.cookies.clockLogin){
    var promise = Administrator.findOne({'_id': mongoose.Types.ObjectId(req.cookies.clockLogin)}).exec();
    promise.then( (result) => {
      var iniMsgDoc = new InitiativeMsg({
        passivityMsgId: '',
        administratorId: req.cookies.clockLogin,
        administratorName: result.name,
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
      });
      return  {'administratorName': iniMsgDoc.administratorName,'initiativeMsgId': mongoose.Types.ObjectId(iniMsgDoc._id).toString()};
    }).then( (result) => {
      var passMsgDoc = new PassivityMsg({
        initiativeMsgId: result.initiativeMsgId,
        administratorId: req.cookies.clockLogin,
        administratorName: result.administratorName,
        userId: req.body.userId,
        userName: req.body.userName,
        userPhone: req.body.userPhone,
        departmentId: req.body.departmentId,
        departmentName: req.body.departmentName,
        date: new Date,
        type: -1
      });
      // 这里不知道什么原因，第三个then运行在第二个then之前，所以使用了地狱嵌套
      passMsgDoc.save( (err,doc) => {
        if(err){
          res.json({
            'status': '-1',
            'msg': '信息插入异常',
            'result': ''
          })
        }else{
           InitiativeMsg.updateOne({
              '_id': mongoose.Types.ObjectId(result.initiativeMsgId)
            }, {
              $set: {'passivityMsgId': mongoose.Types.ObjectId(doc._id).toString()}
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
            })
        }
      });
    })
  }else{
    res.json({
      'status': '-2',
      'msg': '未登录',
      'result': ''
    });
  }
});

/* cancelInvite */
/* 取消邀请用户接口 */
/* 方法：post */
/* 参数：很多*/
router.post('/cancelInvite', (req, res, next) => {
  if(req.cookies.clockLogin){
    // 这个做法显得有点蠢
    let promise = InitiativeMsg.findOne({
          '_id': mongoose.Types.ObjectId(req.body.id)
        }).exec();
    promise.then( (result) => {
      InitiativeMsg.updateOne({
        '_id': mongoose.Types.ObjectId(req.body.id)
      },{
        'type': 2
      }, (err) => {
        if(err){
          console.log(err);
        }
      })
    }).then( (result) => {
      PassivityMsg.deleteOne({'_id': mongoose.Types.ObjectId(req.body.passivityMsgId)}, (err) => {
        if(err){
          res.json({
            'status': '-1',
            'msg': '删除邀请信息异常',
            'result': ''
          });
        }else{
          res.json({
            'status': '1',
            'msg': '取消成功',
            'result': ''
          });
        }
      })
    })

  }else{
    res.json({
      'status': '-2',
      'msg': '未登录',
      'result': ''
    });
  }
});

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
  let promise1 = Department.findOne({
    '_id': mongoose.Types.ObjectId(req.body.depdId)
  }).exec();
  promise1.then( (result) => {
    // console.log(`First val:${JSON.stringify(result)}`);
    Department.updateOne({
      '_id': mongoose.Types.ObjectId(req.body.depdId)
    },{
      $inc: {quantity: -1},
      $pull: {'staffList': {'userId':  req.body.userId}}
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
      '_id': mongoose.Types.ObjectId(req.body.userId)
    }).exec();
    promise2.then( (val)=>{
      // console.log(`Third val:${JSON.stringify(val)}`);
      User.updateOne({
        '_id': mongoose.Types.ObjectId(req.body.userId)
      },{
         $pull: {'dependence': {'depdId':  req.body.depdId}}
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
        'type': 4
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
        'type': 3
      }
      let obj = {'initiativeMsg': IMSG, 'passivityMsg': PMSG};
      return obj;
    }).then( (val)=>{
      let obj1 = val;
      // console.log(`Four val:${JSON.stringify(val)}`);
      let msgPromise = Department.find({
        '_id': mongoose.Types.ObjectId(req.body.depdId)
      }).exec();
      msgPromise.then( (val)=>{
        let iniMsg = new InitiativeMsg(obj1.initiativeMsg);
        iniMsg.save( (err,doc) => {
              if(err){
                res.json({
                    'status': '-1',
                    'msg': '删除失败',
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
                    'msg': '删除失败',
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
                          'msg': '删除成功',
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