var mongoose = require('mongoose');
var Schema = mongoose.Schema;
//创建Schema
var userSchema = new Schema({
	sessionId: String,
    name: String,
    phone: String,
    sex: String,
    age: Number,
    headImg: String,
    dependence: Array,
    nickName: String
});
module.exports = userSchema;
