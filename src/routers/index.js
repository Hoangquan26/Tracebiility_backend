'use strict'

const express = require('express')
const router = express.Router()

//

router.use('/v1/api/access', require('./access.router.js'))

module.exports = router