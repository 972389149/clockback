var mongoose = require('mongoose');
var departmentRecordSchema = require('../schemas/departmentrecord.js');
var DepartmentRecord = mongoose.model('departmentrecords', departmentRecordSchema);
module.exports = DepartmentRecord;