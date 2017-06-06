const express = require('express')
const router = require('express-promise-router')()
const mongoose = require('mongoose')

const UsersController = require('../controllers/users')

router.route('/')
  .get(UsersController.index)
  .post(UsersController.newUser)

router.route('/:userId')
  .get(UsersController.getUser)

module.exports = router
