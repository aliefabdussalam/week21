const express = require('express');
const {
  insert, login, getAllData,
} = require('../controller/register');

const router = express.Router();
router
  .post('/register', insert)
  .post('/login', login)
  .get('/user', getAllData)
module.exports = router;
