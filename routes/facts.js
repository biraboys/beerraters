const router = require('express-promise-router')()
const multer = require('multer')
const fs = require('fs')
const request = require('request')
const Beer = require('../models/beer')

router.get('/', (req, res, next) => {
  console.log('hej')
})

module.exports = router
