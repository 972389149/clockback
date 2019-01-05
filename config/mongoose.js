const mongoose = require('mongoose');
const config = require('./config.js');
module.exports = ()=>{
    // 实例化连接对象
    var db = mongoose.connection;
    // 连接MongoDB数据库
	mongoose.connect(config.mongodb, {useNewUrlParser:true}, function(err){
　　if(err){
　　　　console.log('Connection Error:' + err)
　　}else{
　　　　console.log('Connection success!') }
})
    return db;
}