const User = require('../models/user')
const Review = require('../models/review')
const crypto = require('crypto')
const nodemailer = require('nodemailer')
const async = require('async')
const bcrypt = require('bcryptjs')
const Jimp = require('jimp')
const fs = require('fs')

const controller = module.exports = {
  index: async (req, res, next) => {
    const users = await User.find({})
    res.status(200).json(users)
    // res.status(200).render('users', {users})
  },
  getUserJson: async (req, res, next) => {
    const { userId } = req.params
    const user = await User.findOne({_id: userId}, 'profileImg displayName name description')
    res.status(200).json(user)
  },
  newUser: async (req, res, next) => {
    const [username, name, email, password, country] = [req.body.username, req.body.name, req.body.email, req.body.password, req.body.country]
    const buff = crypto.randomBytes(20)
    const token = buff.toString('hex')
    // 1 Hour from now
    const expires = Date.now() + 3600000

    const newUser = new User({
      username: username,
      name: name,
      email: email,
      password: password,
      following: [],
      followers: [],
      country_id: country,
      displaName: username,
      registrationToken: token,
      registrationTokenExpires: expires
    })

    await newUser.save(err => {
      if (err) {
        if (err.errors) {
          console.log('error')
          res.json({ message: err.errors })
        } else if (err.code === 11000) {
          res.json({ message: err.message })
        }
      } else {
        const stmpTransport = nodemailer.createTransport({
          service: 'Gmail',
          auth: {
            user: process.env.GMAIL_U,
            pass: process.env.GMAIL_PASS
          }
        })
        const mailOptions = {
          to: newUser.email,
          from: 'noreply@beerraters.com',
          subject: 'Please confirm your account - Beerraters.com',
          text: `Hi ${newUser.username},\n\n Thanks for your registration!\n Please confirm your account by clicking the following link:\n http://${req.headers.host}/activation/${token}\n\n If you havent done this before ${newUser.registrationTokenExpires.toLocaleString('en-US')}, the activation link will expire and you'll have to register a new account.`
        }
        stmpTransport.sendMail(mailOptions, err => {
          if (err) { console.log(err) }
          res.json({ message: `Thanks for registering!</br>An email has been sent to ${newUser.email}, follow the instructions to complete the registration.` })
        })
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
      res.status(200).render('user', { followers: amount, follower: false, user, session: req.session.user, id: profileId })
    }
  },
  getUserReviews: async (req, res, next) => {
    const { userId } = req.params
    const userReviews = await User.findOne({_id: userId}, 'reviews').populate('reviews')

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
    const allusers = await User.find({}).populate('country_id')
    const users = await User.findByName(allusers, userName)
    res.status(200).json(users)
  },
  loginUser: async (req, res, next) => {
    const [username, password] = [req.body.username, req.body.password]
    const user = await User.findOne({ username: username.toLowerCase() }, 'password active')
    if (user) {
      if (user.active) {
        if (bcrypt.compareSync(password, user.password)) {
          const userSession = { _id: user._id }
          req.session.user = userSession
          res.redirect(req.session.previousPage)
        } else {
          res.status(400).render('login', { success: false, message: 'Password does not match.', username: username, session: req.session.user })
        }
      } else {
        res.json({ message: 'Please verify your account before logging in.' })
      }
    } else {
      res.status(400).render('login', { success: false, message: `Could not find a user with username - ${username}`, username: username, session: req.session.user })
    }
  },
  editProfile: async (req, res, next) => {
    const user = await User.findOne({ _id: req.session.user._id }, 'profileImg')
    const [name, displayName, description] = [req.body.name, req.body.displayname, req.body.description]

    const currentpass = req.body.currentpass
    const password = req.body.newpass
    const confirmpass = req.body.confirmpass
    let link = user.profileImg

    if (req.files.length > 0) {
      const profileImg = `${req.files[0].filename}`
      const path = `public/uploads/users`
      const image = await Jimp.read(`${path}/${profileImg}`)
      image.resize(128, 128)
      image.quality(60)
      image.write(`${path}/${req.session.user._id}/${profileImg}.png`)
      const filePath = `${path}/${profileImg}`
      fs.unlinkSync(filePath)
      if (user.profileImg.length > 0) {
        fs.unlinkSync(`${path}/${req.session.user._id}/${user.profileImg}`)
      }
      link = `${profileImg}.png`
    }

    if (currentpass && password && confirmpass) {
      const user = await User.findOne({ _id: req.session.user._id }, 'password')
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

    await User.findOneAndUpdate({ _id: req.session.user._id }, {
      $set: {
        name: name,
        displayName: displayName,
        description: description,
        profileImg: link
      }
    })
  },
  followUser: async (req, res, next) => {
    if (req.session.user) {
      const { userId } = req.params
      const [user, session] = await Promise.all([
        User.findById(userId),
        User.findById(req.session.user._id)
      ])
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
            user: process.env.GMAIL_U,
            pass: process.env.GMAIL_PASS
          }
        })
        const mailOptions = {
          to: user.email,
          from: 'noreply@beerraters.com',
          subject: 'Password reset - Beerraters.com',
          text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n Please click on the following link, or paste this into your browser to complete the process:\n http://${req.headers.host}/reset/${token}\n If you did not request this, please ignore this email and your password will remain unchanged.\n`
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
  getResetToken: async(req, res) => {
    await User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, (err, user) => {
      if (!user) {
        res.json({ message: 'Password reset token invalid or has expired.' })
      } else {
        res.render('reset', { token: req.params.token, session: req.session.user })
      }
    })
  },
  getConfirmationToken: async(req, res) => {
    await User.findOne({ registrationToken: req.params.token, registrationTokenExpires: { $gt: Date.now() } }, (err, user) => {
      if (!user) {
        res.json({ message: 'Activation link expired or has already been used. If you didnt activate your account in time, please register again.' })
      } else {
        User.findOneAndUpdate({ _id: user._id }, { $set: { active: true }, $unset: { registrationToken: '', registrationTokenExpires: '' } }, err => {
          if (err) { console.log(err) }
          res.json({ message: 'Successfully activated account!' })
        })
      }
    })
  },
  resetPassword: async(req, res, next) => {
    async.waterfall([
      done => {
        User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, 'password', (err, user) => {
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
