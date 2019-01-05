var mongoose = require('mongoose');
var Schema = mongoose.Schema;
//创建Schema
var passivityMsgSchema = new Schema({
	initiativeMsgId: String,
	administratorId: String,
	administratorName: String,
	userId: String,
	userName: String,
	userPhone: String,
	departmentId: String,
	departmentName: String,
	date: Date,
	type: Number

});
module.exports = passivityMsgSchema;
