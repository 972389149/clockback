var mongoose = require('mongoose');
var administratorSchema = require('../schemas/administrator.js');
//创建model，这个地方的ch_user对应mongodb数据库中ch_users的conllection。
var Administrator = mongoose.model('administrators',administratorSchema);
module.exports = Administrator;