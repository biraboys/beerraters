const User = require('../models/user')
const Review = require('../models/review')

module.exports = {
  index: async (req, res, next) => {
    const users = await User.find({})
    res.status(200).json(users)
    // res.status(200).render('users', {users})
  },
  newUser: async (req, res, next) => {
    const newUser = new User({
      userName: req.body.userName,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: req.body.password
    })
    await newUser.save()
    res.status(200).redirect('login')
  },
  getUser: async (req, res, next) => {
    // const { userId } = req.params
    // const user = await User.findById(userId)
    // res.status(200).render('user', {user})
  },
  getUserReviews: async (req, res, next) => {
    const { userId } = req.params
    const userReviews = await User.findById(userId).populate('reviews')
    res.status(200).render('reviews', userReviews)
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
    const userName = req.body.userName
    const userArr = await User.findByName(userName)
    let user
    if (userArr[0] !== undefined) user = userArr[0].toObject()
    res.status(200).render('user', {user})
  }
}
