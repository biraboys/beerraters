const User = require('../models/user')
const Review = require('../models/review')
const bcrypt = require('bcrypt')

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
      followers: [],
      description: '',
      profileImg: ''
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
      console.log(amount)
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
    const user = await User.findById(req.session.user._id)
    if (req.body.description !== undefined) {
      await user.update({ description: req.body.description })
    }
    if (req.file.filename !== undefined) {
      await user.update({ profileImg: req.file.filename })
    }
  },
  followUser: async (req, res, next) => {
    if (req.session.user) {
      const { userId } = req.params
      const user = await User.findById(userId)
      const session = await User.findById(req.session.user._id)
      const following = session.following
      if (following.indexOf(user._id) > -1) {
        // User is already following this user
        controller.unfollowUser(req, res, next, session, user)
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
  unfollowUser: async (req, res, next, session, user) => {
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
  }
}
