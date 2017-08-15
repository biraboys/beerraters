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
  Beer.findById('594111ecffe15a2652472767', function (err, doc) {
    if (err) return next(err)
    res.contentType(doc.img.contentType)
    res.send(doc.img.data)
  })
  // ftp.put('./public/images/bottle.png', '/uploads/imageapi/public/images/beer/bottle.png', function (hadError) {
  //   if (!hadError) {
  //     console.log('File transferred successfully!')
  //   } else {
  //     console.log(hadError)
  //   }
  // })
  // let str = '' // Will store the contents of the file
  // ftp.get('/uploads/imageapi/public/images/beer/bottle.png', function (err, socket) {
  //   if (err) return
  //   socket.on('data', function (d) { str += d.toString() })
  //   socket.on('close', function (hadErr) {
  //     if (hadErr) {
  //       console.error('There was an error retrieving the file.')
  //     }
  //     console.log(str.length)
  //     res.writeHead(200, { 'Content-Type': 'image/png' })
  //     res.end(str, 'binary')
  //   })
  //   socket.resume()
  // })
})

module.exports = router
