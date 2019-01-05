var mongoose = require('mongoose');
var initiativeMsgSchema = require('../schemas/initiativeMsg.js');
var initiativeMsg = mongoose.model('initiativemsgs',initiativeMsgSchema);
module.exports = initiativeMsg;