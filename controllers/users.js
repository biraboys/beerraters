const User = require('../models/user')
const Review = require('../models/review')
const bcrypt = require('bcrypt')

module.exports = {
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
      password: password
    })
    await newUser.save(err => {
      if (err.errors != null) {
        let errorMessage = { success: false, username: username, name: name, email: email }
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
        res.status(400).render('register', errorMessage)
      } else if (err.code === 11000) {
        res.status(400).render('register', { success: false, message: 'Username or e-mail already taken.', username: username, name: name, email: email })
      } else {
        res.status(201).render('register', { success: true, message: 'User created!' })
      }
    })
  },
  getUser: async (req, res, next) => {
    const { userId } = req.params
    const user = await User.findById(userId)
    res.status(200).render('user', {user})
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
    res.status(200).render('users', {users: users, userName: userName})
  },
  loginUser: async (req, res, next) => {
    const [username, password] = [req.body.username, req.body.password]
    const user = await User.findOne({username: username})
    if (user) {
      if (bcrypt.compareSync(password, user.password)) {
        res.json({ user })
      } else {
        res.status(400).render('login', { success: false, message: 'Password does not match.' })
      }
    } else {
      res.status(400).render('login', { success: false, message: `Could not find a user with username - ${username}` })
    }
  }
}
