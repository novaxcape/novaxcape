require('dotenv').config()
const express = require('express')
const sequelize = require('./database/database')
const PORT = process.env.PORT


const app = express()
app.use(express.json())


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
