var mongoose = require('mongoose');
var Schema = mongoose.Schema;
//创建Schema
var initiativeMsgSchema = new Schema({
	passivityMsgId: String,
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
module.exports = initiativeMsgSchema;
