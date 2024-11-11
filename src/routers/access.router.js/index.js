'use strict'

const express = require('express')
const AccessController = require('../../controllers/access.controller')
const {asyncHandle} = require('../../utils')
const { authUser } = require('../../auths/auth.user')
const router = express.Router()

router.post('/login', asyncHandle(AccessController.login)) 
router.post('/signup', asyncHandle(AccessController.signup)) 
router.post('/userExist', asyncHandle(AccessController.userExist)) 

router.use('/', authUser)
router.post('/refreshToken', asyncHandle(AccessController.refreshToken))
router.post('/logout', asyncHandle(AccessController.logout))
module.exports = router