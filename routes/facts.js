const router = require('express-promise-router')()
const multer = require('multer')

const JSFtp = require('jsftp')

const ftp = new JSFtp({
  host: process.env.FTP_HOST,
  port: 21, // defaults to 21
  user: process.env.FTP_USERNAME, // defaults to "anonymous"
  pass: process.env.FTP_USER_PASS // defaults to "@anonymous"
})

// const upload = multer({ dest: `/public/uploads/beer` })

router.get('/', (req, res, next) => {
  ftp.put('./public/images/beer_bg.jpg', '/uploads/imageapi/public/images/beer/beer_bg.jpg', function (hadError) {
    if (!hadError) {
      console.log('File transferred successfully!')
    } else {
      console.log(hadError)
    }
  })
  // var str = ''; // Will store the contents of the file
  // ftp.get('/uploads/imageapi/public/images/beer/beer-bg.png', function (err, socket) {
  //   if (err) return

  //   socket.on('data', function (d) { str += d.toString() })
  //   socket.on('close', function (hadErr) {
  //     if (hadErr)
  //       {console.error('There was an error retrieving the file.');}
  //   })
  //   socket.resume()
  //   const img = Buffer.from(str, 'base64')
  //   console.log(img)
  //   res.writeHead(200, {'Content-Type': 'image/png', 'Content-Length': img.length})
  //   res.write(img)
  //   res.end()
  // })
  // res.render('facts', { title: 'Beer Facts', session: req.session.user })
})

module.exports = router
