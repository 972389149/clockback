var mongoose = require('mongoose');
var UserSchema = require('../schemas/users.js');
//创建model，这个地方的ch_user对应mongodb数据库中ch_users的conllection。
var User = mongoose.model('users',UserSchema);
module.exports = User;