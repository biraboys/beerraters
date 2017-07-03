const User = require('../models/user')
const Review = require('../models/review')
const multer = require('multer')
const crypto = require('crypto')
const nodemailer = require('nodemailer')
const async = require('async')
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '/public/uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + '.jpg')
  }
})
const upload = multer({ storage: storage }).single('profileImage')
const bcrypt = require('bcryptjs')
const mongoose = require('mongoose')

const controller = module.exports = {
  index: async (req, res, next) => {
    const users = await User.find({})
    res.status(200).json(users)
    // res.status(200).render('users', {users})
  },
  newUser: async (req, res, next) => {
    const [username, name, email, password] = [req.body.username, req.body.name, req.body.email, req.body.password]
    const newUser = new User({
      username: username,
      name: name,
      email: email,
      password: password,
      following: [],
      followers: []
    })
    await newUser.save(err => {
      if (err) {
        const errorMessage = { success: false, username: username, name: name, email: email }
        if (err.errors != null) {
          if (err.errors.name) {
            errorMessage.message = err.errors.name.message
          } else if (err.errors.email) {
            errorMessage.message = err.errors.email.message
          } else if (err.errors.username) {
            errorMessage.message = err.errors.username.message
          } else if (err.errors.password) {
            errorMessage.message = err.errors.password.message
          } else {
            errorMessage.message = err
          }
        } else if (err.code === 11000) {
          errorMessage.message = 'Username or e-mail already taken.'
        } else {
          errorMessage.message = err
        }
        res.status(400).render('register', { errorMessage, session: req.session.user })
      } else {
        res.redirect(`/register/${username}`)
      }
    })
  },
  getUser: async (req, res, next) => {
    const { userId } = req.params
    const user = await User.findById(userId)
    const profileId = user.id
    if (req.session.user) {
      const session = await User.findById(req.session.user._id)
      const follow = await controller.checkIfFollowed(user._id, session)
      const amount = user.followers.length
      res.status(200).render('user', { followers: amount, follower: follow, user, session: req.session.user, id: profileId })
    } else {
      const amount = user.followers.length
      console.log(amount)
      res.status(200).render('user', { followers: amount, follower: false, user, session: req.session.user, id: profileId })
    }
  },
  getUserReviews: async (req, res, next) => {
    const { userId } = req.params
    const userReviews = await User.findById(userId).populate('reviews')
    // res.status(200).render('reviews', userReviews)
    res.status(200).json(userReviews)
  },
  newUserReview: async (req, res, next) => {
    const { userId } = req.params
    // Create a new review
    const newReview = new Review(req.body)
    // Get user
    const user = await User.findById(userId)
    // Bind review and user
    newReview.user = user
    // Save review
    await newReview.save()
    // Add review to user
    user.reviews.push(newReview)
    // Save user
    await user.save()

    res.status(201).json(newReview)
  },
  findUser: async (req, res, next) => {
    const userName = req.query.q
    const allusers = await User.find({})
    const users = await User.findByName(allusers, userName)
    res.status(200).render('users', { users: users, userName: userName, session: req.session.user })
  },
  loginUser: async (req, res, next) => {
    const [username, password] = [req.body.username, req.body.password]
    const user = await User.findOne({ username: username.toLowerCase() })
    if (user) {
      if (bcrypt.compareSync(password, user.password)) {
        const userSession = { _id: user._id }
        req.session.user = userSession
        res.redirect('/')
      } else {
        res.status(400).render('login', { success: false, message: 'Password does not match.', username: username, session: req.session.user })
      }
    } else {
      res.status(400).render('login', { success: false, message: `Could not find a user with username - ${username}`, username: username, session: req.session.user })
    }
  },
  editProfile: async (req, res, next) => {
    const [description, currentpass, password, confirmpass] = [req.body.description, req.body.currentpass, req.body.newpass, req.body.confirmpass]
    if (description) {
      await User.update({_id: req.session.user._id}, { description: description })
    }
    if (currentpass && password && confirmpass) {
      const user = await User.findById(req.session.user._id)
      if (bcrypt.compareSync(currentpass, user.password)) {
        if (password === confirmpass) {
          user.password = password
          await user.save(err => {
            if (err.errors.password) {
              res.json({ errMsg: err.errors.password.message })
            }
          })
        } else {
          res.json({ message: 'Make sure new password match' })
        }
      } else {
        res.json({ message: 'Current password does not match.' })
      }
    }

    // if (req.file) {
    //   upload(req, res, err => {
    //     if (err) {
    //       console.log(err)
    //     }
    //     res.status(200)
    //   })
    //   await user.update({ profileImg: req.file.filename })
    // }
  },
  followUser: async (req, res, next) => {
    if (req.session.user) {
      const { userId } = req.params
      const user = await User.findById(userId)
      const session = await User.findById(req.session.user._id)
      const following = session.following
      if (following.indexOf(user._id) > -1) {
        // User is already following this user
        controller.unfollowUser(res, session, user)
      } else {
        // User is not following and will now follow this user
        await User.findOneAndUpdate({ _id: session._id }, { $push: { following: user._id } })
        await User.findOneAndUpdate({ _id: user._id }, { $push: { followers: session._id } })
        res.status(200).send()
      }
    } else if (!req.session.user) {
      res.status(401).send()
    }
  },
  unfollowUser: async (res, session, user) => {
    await User.findOneAndUpdate({ _id: session._id }, { $pull: { following: user._id } })
    await User.findOneAndUpdate({ _id: user._id }, { $pull: { followers: session._id } })
    res.status(200).send()
  },
  checkIfFollowed: async (user, session) => {
    const following = session.following
    if (following.indexOf(user) > -1) {
      const follower = true
      return follower
    } else {
      const follower = false
      return follower
    }
  },
  getUserFollowers: async (req, res, next) => {
    const { userId } = req.params
    const user = await User.findById(userId)
    const currentUser = { username: user.username, id: user._id }

    const followers = await User.find({ '_id': user.followers }, { password: 0, following: 0, description: 0, email: 0, ratings: 0, reviews: 0, consumes: 0 }, (err, result) => {
      if (err) {
        console.log(err)
      }
      return result
    })
    res.status(200).render('followers', { user: currentUser, followers: followers, session: req.session.user })
  },
  forgotPassword: async(req, res, next) => {
    async.waterfall([
      done => {
        crypto.randomBytes(20, (err, buff) => {
          const token = buff.toString('hex')
          done(err, token)
        })
      },
      (token, done) => {
        User.findOne({ email: req.body.email }, (err, user) => {
          if (!user) {
            res.json({ success: false, message: 'No user found with that email adress.' })
          } else {
            User.findOneAndUpdate({ _id: user._id }, { $set: { resetPasswordToken: token, resetPasswordExpires: Date.now() + 3600000 } }, err => {
              done(err, token, user)
            })
          }
        })
      },
      (token, user, done) => {
        const stmpTransport = nodemailer.createTransport({
          service: 'Gmail',
          auth: {
            user: 'beerraters0@gmail.com',
            pass: 'beerraters2017'
          }
        })
        const mailOptions = {
          to: user.email,
          from: 'noreply@beerraters.com',
          subject: 'Password reset - Beerraters.com',
          text:
          `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n
          Please click on the following link, or paste this into your browser to complete the process:\n
          http://${req.headers.host}/reset/${token}\n
          If you did not request this, please ignore this email and your password will remain unchanged.\n`
        }
        stmpTransport.sendMail(mailOptions, err => {
          console.log('mail sent')
          res.json({ success: true, message: `An email has been sent to ${user.email} with further instructions.` })
          done(err, 'done')
        })
      }
    ], err => {
      if (err) return next(err)
      res.redirect('/forgot')
    })
  },
  findToken: async(req, res) => {
    await User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, (err, user) => {
      if (!user) {
        res.json({ message: 'Password reset token invalid or has expired.' })
      } else {
        res.render('reset', { token: req.params.token, session: req.session.user })
      }
    })
  },
  resetPassword: async(req, res, next) => {
    async.waterfall([
      done => {
        User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, (err, user) => {
          if (!user) {
            res.json({ message: 'Password reset token is invalid or has expired.' })
          }
          if (req.body.password === req.body.confirmpass) {
            user.password = req.body.password
            user.resetPasswordExpires = null
            user.resetPasswordToken = ''

            user.save(err => {
              if (err) {
                if (err.errors != null) {
                  if (err.errors.password) {
                    res.json({ message: err.errors.password.message })
                  } else if (err) {
                    console.log(err)
                  } else {
                    done(err, user)
                  }
                } else {
                  console.log(err)
                }
              } else {
                res.json({ success: true, message: `<span style="color:green">Successfully changed password! Login <a href="/login">here</a></span>`, session: req.session.user })
              }
            })
          } else {
            res.json({ message: '<span style="color:red">Password does not match.</span>' })
          }
        })
      }
    ])
  }
}
