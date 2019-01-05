var mongoose = require('mongoose');
var Schema = mongoose.Schema;
//创建Schema
var administratorSchema = new Schema({
	phone: String,
	clockAccount: String,
	clockPassword: String,
	name:String,
	depLength: Number,
	departmentList:Array
});
module.exports = administratorSchema;
