const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const DepartmentRecord = require('../models/departmentRecord.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
