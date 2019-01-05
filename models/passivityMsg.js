var mongoose = require('mongoose');
var passivityMsgSchema = require('../schemas/passivityMsg.js');
var passivityMsg = mongoose.model('passivitymsgs', passivityMsgSchema);
module.exports = passivityMsg;