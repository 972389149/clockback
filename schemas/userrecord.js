var mongoose = require('mongoose');
var Schema = mongoose.Schema;
//创建Schema
var userRecordSchema = new Schema({
	userId: String,
	openid: String,
	canClock: Array,
	waitClock: Array,
	hasClocked: Array,
	absenceClocked: Array
});
module.exports = userRecordSchema;
