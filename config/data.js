// administrator => {
// 	'_id': 'hiqwOEFP4531',
// 	'phone': '123',
// 	'clockAccount': '123',
// 	'clockPassword': '123',
// 	'name': '于希',
// 	'depLength': 1,
// 	'departmentList':[{				  //拥有的部门
// 		'deptId': '2312iefkwosjrluhs' //部门ID
// 	}]
// }

// users => {
// 	'_id': '1asdqwjnobe',
// 	'sessionId': '45SD23',
// 	'phone': '123',
// 	'name': '于希',
// 	'sex': 'male',
// 	'age': '21',
// 	'image': '1.jpg',
// 	'depdLength':0,
// 	'dependence':[{                  //加入的部门
// 		'depdId': '2312iefkwosjrluhs' //部门ID
// 	}]
// }
// departments => {
// 	'_id': '2312iefkwosjrluhs', 						//主码
// 	'name': '财务部', 									//名称
// 	'administrator': {									//管理层
// 		'administratorName': '于希', 					//管理者名字
// 		'administratorId': 'hiqwOEFP4531', 				//管理者id
// 		'administratorPhone': '123', 					//管理者手机
// 	},
// 	'clockDate': { 										//打卡日期
// 		'duration'： 2, 									//持续天数
// 		'type': 1, 										// 1:工作日打卡，2:周末打卡 
// 		'date': ['2018.10.01','2018.10.02']
// 	},
// 	'clockDayTimes': 2, 								//一天打卡次数
// 	'clockList':[{										//一天内的打卡时间
// 		'clockStart': '8:00',							//开始时间
// 		'clockEnd': '8:30'								//结束时间
// 	},{
// 		'clockStart': '2:00',
// 		'clockEnd': '2:30'
// 	}],
// 	'quantity': 1,										//员工数量
// 	'staffList':[{										//员工列表
// 		'usersId': '1asdqwjnobe',
// 		'phone':'123',
// 		'name': '于希',
// 		'sex': 'male',
// 		'age': '21',
// 		'image': '1.jpg'
// 	}],
// 	'address': [1231,1231]                              //打卡地点(经纬度)	
// }

// initiativeMsg => {										//主动信息是管理者看(带操作权限)
// 	'_id': 'w8o9iose',
//  'passivityMsgId': '123',
// 	'administratorId': 'hiqwOEFP4531',
//  'administratorName': '希门吹水',
// 	'userId': '1asdqwjnobe',
//  'userName': '陈1希',
//  'userPhone': '18302039155',
//  'departmentId': 'asghj11',
//  'departmentName': '青铜组',
//  'date': '2018-01-01',
// 	'type': -1/0/1/2/3/4										// -1:待定 0:邀请成功 1:邀请失败 2:邀请取消 3:用户退群 4.踢人
// }

// passivityMsg => {										//被动信息是用户看(带操作权限)
// 	'_id': 'wisadqmzcx',
//  'initiativeMsgId': '123',
// 	'administratorId': 'hiqwOEFP4531',
//  'administratorName': '希门吹水',
//  'userName': '陈1希',
//  'userPhone': '18302039155',
// 	'usersId': '1asdqwjnobe',
//  'departmentId': 'asghj11',
//  'departmentName': '青铜组',
//  'date': '2018-01-01',
// 	'type': -1/0/1/2/3                                   // -1:邀请信息 0:加入成功 1:拒绝加入 2:退出成功 3:被踢
// }

// usersRecord => {										//一个用户对应一个record
// 	'_id': 'dasl3rwejdkk',
// 	'usersId': '1asdqwjnobe', 							//用户id
// 	'record':[{
// 		'deptId': '2312iefkwosjrluhs',         			// 部门id
// 		'adminId': 'hiqwOEFP4531',						//管理者id
// 		'clockTime': '2018-10-01 08:10',				//打卡时间
// 		'clockAddress': [12312,4345454]					//打卡位置
// 	}]
// }

// departmentRecord => {									//一个部门对应一个record
// 	'_id': '2163saf456zx1c32',
// 	'deptId': '2312iefkwosjrluhs',						//部门id
// 	'adminId': 'hiqwOEFP4531',							//管理者id
// 	'record': [{										//记录
// 		'usersId': '1asdqwjnobe',						//用户id
// 		'usersRecordId': ['dasl3rwejdkk']				//用户打卡记录id
// 	}]
// }

// userrecord => {
// 	'_id': '....',
// 	'userId': '...',
// 	'openid': '...',
// 	'canClock': [{
// 		'deptId': '...',
// 		'adminId': '...',
// 		'clockStart': '...',
// 		'clockEnd': '...',
// 		'clockDate': '...',
// 		'address': ['...','...']
// 	}],
// 	'waitClock': [{
// 		'deptId': '...',
// 		'adminId': '...',
// 		'clockStart': '...',
// 		'clockEnd': '...',
// 		'clockDate': '...',
// 		'address': ['...','...']
// 	}],
// 	'hasClocked': [{
// 		'deptId': '...',
// 		'adminId': '...',
// 		'clockStart': '...',
// 		'clockEnd': '...',
// 		'clockDate': '...',
// 	 	'clockTime': '...',
// 		'address': ['...','...'],
// 	 	'clockAddress': ['...','...']
// 	}],
//	'absenceClocked': [{
// 		'deptId': '...',
// 		'adminId': '...',
// 		'clockStart': '...',
// 		'clockEnd': '...',
// 		'clockDate': '...',
// 		'address': ['...','...']
//	}]
// }

// departmentrecord => {
// 	'_id': '...',
// 	'deptId': '...',
// 	'adminId': '...',
//	'hasClocked':[{
// 		'userId': '...',
// 		'clockDate': '...',
// 		'clockStart': '...',
// 		'clockEnd': '...',
// 		'clockTime': '...',
// 		'clockAddress': ['...','...']
//   }],
//	 'noClocked':[{
// 		'userId': '...',
// 		'clockDate': '...', 
// 		'clockStart': '...',
// 		'clockEnd': '...',
// 		'clockAddress': ['...','...']
// 	 }]
// }
