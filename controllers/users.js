const User = require('../models/user')
const Review = require('../models/review')

module.exports = {
  index: async (req, res, next) => {
    const users = await User.find({})
    res.status(200).json(users)
    // res.status(200).render('users', {users})
  },
  newUser: async (req, res, next) => {
    const username = req.body.username
    const name = req.body.name
    const email = req.body.email
    const password = req.body.password

    const newUser = new User({
      username: username,
      name: name,
      email: email,
      password: password
    })
    if (req.body.username === null || req.body.name === null || req.body.email === null || req.body.password === null || req.body.username === '' || req.body.name === '' || req.body.email === '' || req.body.password === '') {
      res.status(400).render('register', { success: false, message: 'Ensure username, name, email and password were provided' })
    } else {
      await newUser.save((err) => {
        if (err) {
          if (err.errors != null) {
            let errorMessage
            if (err.errors.name) {
              errorMessage = { success: false, message: err.errors.name.message, username: username, name: name, email: email }
              res.status(400).render('register', errorMessage)
            } else if (err.errors.email) {
              errorMessage = { success: false, message: err.errors.email.message, username: username, name: name, email: email }
              res.status(400).render('register', errorMessage)
            } else if (err.errors.username) {
              errorMessage = { success: false, message: err.errors.username.message, username: username, name: name, email: email }
              res.status(400).render('register', errorMessage)
            } else if (err.errors.password) {
              errorMessage = { success: false, message: err.errors.password.message, username: username, name: name, email: email }
              res.status(400).render('register', errorMessage)
            } else {
              res.status(400).render('register', { success: false, message: err })
            }
          } else if (err) {
            if (err.code === 11000) {
              res.status(400).render('register', { success: false, message: 'Username or e-mail already taken.' })
            } else {
              res.status(400).render('register', { success: false, message: err })
            }
          }
        } else {
          // console.log({ success: true, message: 'User created!' })
          res.status(201).render('register', { success: true, message: 'User created!' })
        }
      })
    }
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
  }
}
