var mongoose = require('mongoose');
var Schema = mongoose.Schema;
//创建Schema
var departmentSchema = new Schema({
	name: String,
	administrator: Object,
	clockDate: Object,
	clockDayTimes: Number,
	clockList: Array,
	quantity: Number,
	staffList: Array,
	address: Array
});
module.exports = departmentSchema;
