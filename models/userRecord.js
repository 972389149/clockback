var mongoose = require('mongoose');
var userRecordSchema = require('../schemas/userrecord.js');
var UserRecord = mongoose.model('userrecords', userRecordSchema);
module.exports = UserRecord;