var mongoose = require('mongoose');
var Schema = mongoose.Schema;
//创建Schema
var departmentRecordSchema = new Schema({
	deptId: String,
	adminId: String,
	hasClocked: Array,
	noClocked: Array
});
module.exports = departmentRecordSchema;
