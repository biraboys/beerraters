const router = require('express-promise-router')()
const multer = require('multer')
const fs = require('fs')
const request = require('request')
const Beer = require('../models/beer')

// const JSFtp = require('jsftp')

// const ftp = new JSFtp({
//   host: process.env.FTP_HOST,
//   port: 21, // defaults to 21
//   user: process.env.FTP_USERNAME, // defaults to "anonymous"
//   pass: process.env.FTP_USER_PASS // defaults to "@anonymous"
// })

// const upload = multer({ dest: `/public/uploads/beer` })

router.get('/', (req, res, next) => {
  console.log('hej')
})

module.exports = router
