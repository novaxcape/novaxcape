require('dotenv').config()
const express = require('express')
const sequelize = require('./database/database')
const PORT = process.env.PORT
const express_session = require('express-session')
const swaggerUi = require('swagger-ui-express');
const swagger= require('./swagger')
const {passport} =require ('./middleware/passport')


const clientRoutes = require('./route/client')

const rateLimit = require('express-rate-limit')

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	limit: 5, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
    message: 'Too many requests, please try again after 5 minutes',
	standardHeaders: 'draft-8', // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
	ipv6Subnet: 56, // Set to 60 or 64 to be less aggressive, or 52 or 48 to be more aggressive
	// store: ... , // Redis, Memcached, etc. See below.
})

const app = express()
app.use(express.json())

app.use('/apisDocs', swaggerUi.serve, swaggerUi.setup(swagger))

app.use('/api/v1/login', limiter)


app.use(express_session({
    secret: 'Oshio-Ella',
    resave: true,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

// Use routes
app.use('/api/v1/client', clientRoutes)

app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return res.status(400).json({
            message: 'Invalid JSON body. Please check your request body syntax.'
        })
    }

    next(err)
})

const databaseConnection = async () => {
    try {
        await sequelize.authenticate()
        console.log('database connected successfully')

        app.listen(PORT, () => {
            console.log(`Server is listening on port: ${PORT}`)
        })
    } catch (error) {
        console.log('unable to connect to database:', error.message)
    }
}

databaseConnection()
 
