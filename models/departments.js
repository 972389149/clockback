var mongoose = require('mongoose');
var departmentSchema = require('../schemas/departments.js');
//创建model，这个地方的ch_user对应mongodb数据库中ch_users的conllection。
var Department = mongoose.model('departments',departmentSchema);
module.exports = Department;