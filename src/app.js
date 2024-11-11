const dotenv = require('dotenv')
dotenv.config()
const express = require('express')
const app = express()
const cookieParser = require('cookie-parser');
const compression = require('compression')
const morgan = require('morgan')
const helmet = require('helmet')
const cors = require('cors')
//initial middleware
app.use(cors({
    origin: 'http://localhost:5173' ,
    credentials: true
}));
app.use(helmet())
app.use(compression())
app.use(morgan("dev"))
app.use(express.json())
app.use(cookieParser())
//initial database
const databaseInstances = require('./databases/init.database');
const UserHeader = require('./configs/user.header.config');
const statusCodes = require('./utils/statuscode/statusCodes');
//initital router

app.use('', require('./routers/index'))


//handling error

app.use((req, res, next) => {
    const error = new Error('Not Found')
    const statusCode = 404
    error.status = 404
    return next(error)
})

app.use((error, req, res, next) => {
    const statusCode = error.status || 500
    if( statusCode == statusCodes.NON_AUTHORITATIVE_INFORMATION)
    {
        res.clearCookie(UserHeader.REFRESH_TOKEN)
        res.clearCookie(UserHeader.USERID)
    }
    console.error(`!!!Error stack:::${error.stack}`)
    return res.status(statusCode).json({
        message: error.message || 'Internal Server Error',
        status: 'error',
        code: statusCode
    })
})
module.exports = app