const User = require('../models/user')
const Beer = require('../models/beer')
const Review = require('../models/review')
const crypto = require('crypto')
const nodemailer = require('nodemailer')
const async = require('async')
const bcrypt = require('bcryptjs')
const Jimp = require('jimp')
const Feed = require('../models/feed')
const JSONStream = require('JSONStream')

module.exports = {
  newUser: async (req, res, next) => {
    const [username, name, email, password, country] = [req.body.username, req.body.name, req.body.email, req.body.password, req.body.country]
    const buff = crypto.randomBytes(20)
    const token = buff.toString('hex')
    // 1 Hour from Date.now()
    const expires = Date.now() + 3600000
    const newUser = new User({
      username: username,
      name: name,
      email: email,
      password: password,
      following: [],
      followers: [],
      registrationToken: token,
      registrationTokenExpires: expires,
      country_id: country
    })
    Jimp.read('./public/images/user-placeholder.png', function (err, image) {
      image.quality(60)
      image.getBuffer('image/png', async function (err, data) {
        if (err) throw err
        await User.findByIdAndUpdate(newUser._id, { $set: { profileImg: { data: data, contentType: 'image/png' } } })
      })
    })

    await newUser.save(err => {
      if (err) {
        if (err.errors) {
          res.status(400).json({ message: err.errors })
        } else if (err.code === 11000) {
          res.status(400).json({ message: err.message })
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
          text: `Hi ${newUser.username},\n\n Thanks for your registration!\n Please confirm your account by clicking the following link:\n http://${req.headers.host}/activation/${token}\n\n If you havent done this before ${newUser.registrationTokenExpires.toLocaleString('en-US')}, the activation link will expire and you'll have to register again.`
        }
        stmpTransport.sendMail(mailOptions, err => {
          if (err) { console.log(err) }
          res.json({ message: `An email has been sent to ${newUser.email}, follow the instructions to complete the registration.` })
        })
      }
    })
  },

  userJson: async (req, res, next) => {
    const id = req.params.userId
    await User.findOne({ _id: id }, 'description name', (err, user) => {
      if (err) {
        res.status(404).render('/404').end()
      } else {
        res.status(200).json(user)
      }
    })
  },
  renderUser: async (req, res, next) => {
    const { userId } = req.params
    const user = await User.findById(userId, 'consumes ratings reviews images followers following username description name active status registered country_id', '-images.data').populate('country_id', 'flag')
    res.status(200).render('user', { user: user, session: req.session.user })
  },
  getUserConsumes: async (req, res, next) => {
    const { userId } = req.params
    const userConsumes = await User.findById(userId, 'consumes')
    res.status(200).json(userConsumes)
  },
  getUserRatings: async (req, res, next) => {
    const { userId } = req.params
    const userRatings = await User.findById(userId, 'ratings')
    res.status(200).json(userRatings)
  },
  getUserReviews: async (req, res, next) => {
    const { userId } = req.params
    const userReviews = await User.findById(userId, 'reviews')
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
    await User.find({
      'username': { '$regex': userName, '$options': 'i' }
    }, '-__v -password -email -profileImg -images.data -images.contentType -resetPasswordToken -resetPasswordExpires -reactivationToken -registrationToken -registrationTokenExpires')
    .lean()
    .cursor()
    .pipe(JSONStream.stringify())
    .pipe(res)
  },
  loginUser: async (req, res, next) => {
    const [username, password] = [req.body.username, req.body.password]
    const user = await User.findOne({ username: username.toLowerCase() }, 'password active')
    if (user) {
      if (user.active) {
        if (bcrypt.compareSync(password, user.password)) {
          const userSession = { _id: user._id }
          req.session.user = userSession
          await User.findByIdAndUpdate(userSession, { $set: { status: true } })
          res.status(200).json({ success: true, message: 'Success!' })
        } else {
          res.status(400).json({ success: false, active: true, message: 'Password does not match.' })
        }
      } else if (!user.password) {
        res.status(400).json({ success: false, active: false, message: 'User not active, please reactivate your account first.' })
      } else {
        res.status(400).json({ success: false, active: false, message: 'Please verify your account before logging in.' })
      }
    } else {
      res.status(400).json({ success: false, active: true, message: 'Could not find user with username' })
    }
  },
  logoutUser: async (req, res, next) => {
    await User.findByIdAndUpdate(req.session.user._id, { $set: { status: false } })
    req.session.destroy(err => {
      if (err) {
        res.status(500).json({ err: 'Internal server error' })
      }
      if (req.session === undefined) {
        res.status(200).json({ msg: 'Successfully logged out!' })
      }
    })
  },
  editProfile: async (req, res, next) => {
    const { userId } = req.params
    const [name, displayName, description] = [req.body.name, req.body.displayname, req.body.description]
    if (req.file !== undefined) {
      const image = await Jimp.read(req.file.buffer)
      image.cover(150, 150)
      image.quality(60)
      image.getBuffer('image/png', async function (err, data) {
        if (err) throw err
        await User.findByIdAndUpdate(userId, { $set: { profileImg: { data: data, contentType: 'image/png' } } })
      })
    }

    await User.findOneAndUpdate({ _id: req.session.user._id }, {
      $set: {
        name: name,
        displayName: displayName,
        description: description
      }
    }, (err) => {
      if (err) { console.log(err) }
      res.redirect(`/users/${req.params.userId}`)
    })
  },
  getProfileImage: async (req, res, next) => {
    const { userId } = req.params
    User.findById(userId, (err, doc) => {
      if (err) return next(err)
      res.contentType(doc.profileImg.contentType)
      res.status(200).send(doc.profileImg.data)
    })
  },
  checkUserPassword: async (req, res, next) => {
    const [id, password] = [req.params.userId, req.body.password]
    const user = await User.findOne({ _id: id }, 'password')
    if (bcrypt.compareSync(password, user.password)) {
      res.json({ success: true })
    } else {
      res.json({ message: 'Password does not match' })
    }
  },
  removeUserAccount: async (req, res, next) => {
    const id = req.params.userId
    const user = await User.findByIdAndUpdate(id, {
      $unset: {
        password: '',
        name: '',
        resetPasswordExpires: '',
        resetPasswordToken: '',
        followers: '',
        following: '',
        description: '',
        country_id: ''
      },
      $set: {
        active: false,
        status: false
      }
    })
    if (!user) {
      res.status(404).json({ message: 'No user found' })
    } else {
      Jimp.read('./public/images/user-placeholder.png', function (err, image) {
        image.quality(60)
        image.getBuffer('image/png', async function (err, data) {
          if (err) throw err
          await User.findByIdAndUpdate(user._id, { $set: { profileImg: { data: data, contentType: 'image/png' } } })
        })
      })
      req.session.destroy(err => {
        if (err) {
          res.status(500).json({ err: 'Internal server error' })
        } else {
          res.json({ message: 'Your account has successfully been deleted', user: user })
        }
      })
    }
  },
  changePassword: async (req, res, next) => {
    const [currentpass, password, confirmpass] = [req.body.currentpass, req.body.newpass, req.body.confirmpass]

    if (currentpass && password && confirmpass) {
      const user = await User.findOne({ _id: req.session.user._id }, 'password')
      if (bcrypt.compareSync(currentpass, user.password)) {
        if (password === confirmpass) {
          user.password = password
          user.save(err => {
            if (err) {
              if (err.errors) {
                res.json({ message: err.errors.password.message })
              }
            } else {
              res.json({ message: 'Password has now been changed!' })
            }
          })
        } else {
          res.json({ message: 'Make sure new password match' })
        }
      } else {
        res.json({ message: 'Current password does not match.' })
      }
    }
  },
  followUser: async (req, res, next) => {
    if (req.session.user) {
      const { userId } = req.params
      const user = await User.findById(userId, 'followers')
      if (user.followers.indexOf(req.session.user._id) > -1) {
        await User.findByIdAndUpdate(req.session.user._id, { $pull: { following: user._id } })
        await User.findByIdAndUpdate(userId, { $pull: { followers: req.session.user._id } })
        const updatedUser = await User.findById(userId, 'followers')
        res.status(200).json({status: 'Follow', amount: updatedUser.followers.length || 0})
      } else {
        await User.findByIdAndUpdate(req.session.user._id, { $push: { following: user._id } })
        await User.findByIdAndUpdate(userId, { $push: { followers: req.session.user._id } })
        const updatedUser = await User.findById(userId, 'followers')
        res.status(200).json({status: 'Unfollow', amount: updatedUser.followers.length || 0})
      }
    } else {
      res.status(403).end()
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
  getUserFollowing: async (req, res, next) => {
    const { userId } = req.params
    const user = await User.findById(userId, 'following').populate('following', 'username status')
    res.json(user)
  },
  getUserFollowers: async (req, res, next) => {
    const { userId } = req.params
    const user = await User.findById(userId, 'followers').populate('followers', 'username status')
    res.json(user)
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
          if (!user || err) {
            res.json({ success: false, message: 'No user found with that email adress.' })
          } else {
            User.findOneAndUpdate({ _id: user._id }, { $set: { resetPasswordToken: token, resetPasswordExpires: Date.now() + 3600000 } }, err => {
              if (!user.active) {
                res.json({ success: false, message: 'User must be registered and active to do this.' })
              } else {
                done(err, token, user)
              }
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
          text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n Please click on the following link, or paste this into your browser to complete the process:\n\n http://${req.headers.host}/reset/${token}\n\n If you did not request this, please ignore this email and your password will remain unchanged.\n`
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
      if (!user || err) {
        res.json({ message: 'Password reset token invalid or has expired.' })
      } else {
        res.render('reset', { token: req.params.token, session: req.session.user })
      }
    })
  },
  getConfirmationToken: async(req, res) => {
    await User.findOne({ registrationToken: req.params.token, registrationTokenExpires: { $gt: Date.now() } }, (err, user) => {
      if (!user) {
        res.status(200).render('activation', { success: false, message: 'Activation link expired or has already been used. If you didnt activate your account in time, please register again.', session: req.session.user })
      } else {
        User.findOneAndUpdate({ _id: user._id }, { $set: { active: true }, $unset: { registrationToken: '', registrationTokenExpires: '' } }, err => {
          if (err) { console.log(err) }
          res.status(200).render('activation', { success: true, message: 'You have successfully activated your account! You may now login', session: req.session.user })
        })
      }
    })
  },
  resetPassword: async(req, res, next) => {
    async.waterfall([
      done => {
        User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, 'password', (err, user) => {
          if (!user || err) {
            res.json({ message: 'Password reset token is invalid or has expired.' })
          }
          if (req.body.password === req.body.confirmpass) {
            user.password = req.body.password
            user.resetPasswordToken = undefined
            user.resetPasswordExpires = undefined

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
                res.status(200).json({ success: true, session: req.session.user })
              }
            })
          } else {
            res.json({ success: false })
          }
        })
      }
    ])
  },
  getUserImages: async (req, res, next) => {
    const { userId } = req.params
    User.findById(userId, async function (err, doc) {
      if (err) return next(err)
      res.set({
        'Beer-Name': doc.images[req.body.index].beer_name,
        'Content-Type': doc.images[req.body.index].contentType
      })
      res.send(doc.images[req.body.index].data)
    })
  },
  resendActivationMail: async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email })
    if (!user) {
      res.json({ success: false, message: 'No user found with that email adress.' })
    } else {
      if (user.registrationToken) {
        const stmpTransport = nodemailer.createTransport({
          service: 'Gmail',
          auth: {
            user: process.env.GMAIL_U,
            pass: process.env.GMAIL_PASS
          }
        })
        const mailOptions = {
          to: req.body.email,
          from: 'noreply@beerraters.com',
          subject: 'Please confirm your account - Beerraters.com',
          text: `Hi ${user.username},\n\n Thanks for your registration!\n Please confirm your account by clicking the following link:\n http://${req.headers.host}/activation/${user.registrationToken}\n\n If you havent done this before ${user.registrationTokenExpires.toLocaleString('en-US')}, the activation link will expire and you'll have to register again.`
        }
        await stmpTransport.sendMail(mailOptions, err => {
          if (err) {
            console.log(err)
          } else {
            res.json({ success: true, message: `An email has been sent to ${user.email}, follow the instructions to complete the registration.` })
          }
        })
      } else {
        res.json({ success: false, message: 'This user is already active.' })
      }
    }
  },
  feedback: async (req, res, next) => {
    const [subjectChosen, feedbackInputValue] = [req.body.subjectChosen, req.body.feedbackInputValue]
    const stmpTransport = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.GMAIL_U,
        pass: process.env.GMAIL_PASS
      }
    })
    const mailOptions = {
      to: process.env.GMAIL_U,
      from: process.env.GMAIL_U,
      subject: `${subjectChosen} - Beerraters.com`,
      text: `${feedbackInputValue}\n\n Submitted by: http://localhost:6889/users/${req.session.user._id}`
    }
    await stmpTransport.sendMail(mailOptions, err => {
      if (err) {
        res.status(500).json({ message: 'Something went wrong, please try again later.' })
      } else {
        res.status(200).json({ message: 'Thanks for your feedback!' })
      }
    })
  },
  checkUser: async (req, res, next) => {
    if (req.session.user._id === req.params.userId) {
      res.status(200).render('edit', { session: req.session.user })
    } else {
      res.redirect(`/users/${req.session.user._id}`)
    }
  },
  getLoginPageFromActivationEmail: async (req, res, next) => {
    const { username } = req.params
    res.render('login', { success: true, username: username, session: req.session.user })
  },
  sendReactivationMail: async(req, res, next) => {
    async.waterfall([
      done => {
        crypto.randomBytes(20, (err, buff) => {
          const token = buff.toString('hex')
          done(err, token)
        })
      },
      (token, done) => {
        User.findOne({ email: req.body.email }, (err, user) => {
          if (!user || err) {
            res.json({ success: false, message: 'No user found with that email adress.' })
          } else {
            if (user.active) {
              res.json({ success: false, message: 'This user is already active.' })
            } else {
              User.findOneAndUpdate({ _id: user._id }, { $set: { reactivationToken: token } }, err => {
                if (err) {
                  res.json({ success: false, message: 'Something went wrong, please try again later.' })
                } else {
                  done(err, token, user)
                }
              })
            }
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
          subject: 'Reactivation of account - Beerraters.com',
          text: `We are glad you want to join us again!\n Please click on the following link, or paste this into your browser to reactivate your account:\n\n http://${req.headers.host}/reactivate/${token}\n\n`
        }
        stmpTransport.sendMail(mailOptions, err => {
          console.log('mail sent')
          res.json({ success: true, message: `An email has been sent to ${user.email} with further instructions.` })
          done(err, 'done')
        })
      }
    ], err => {
      if (err) return next(err)
      res.redirect('/reactivate')
    })
  },
  getReactivationToken: async (req, res, next) => {
    await User.findOne({ reactivationToken: req.params.token }, (err, user) => {
      if (!user || err) {
        res.status(400).json({ message: 'Something went wrong, please try again later.' })
      } else {
        res.render('activate', { token: req.params.token, session: req.session.user })
      }
    })
  },
  activateUserAccount: async (req, res, next) => {
    async.waterfall([
      done => {
        User.findOne({ reactivationToken: req.params.token }, 'password', (err, user) => {
          if (!user || err) {
            res.json({ message: 'Something went wrong, please try again later.' })
          } else {
            if (req.body.password === req.body.confirmpass) {
              user.password = req.body.password
              user.active = true
              user.reactivationToken = undefined

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
                  res.status(200).json({ success: true, session: req.session.user })
                }
              })
            } else {
              res.json({ success: false })
            }
          }
        })
      }
    ])
  }
}
