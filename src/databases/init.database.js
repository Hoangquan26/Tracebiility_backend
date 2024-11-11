const mongoose = require('mongoose')

class Database {
    constructor(){
        this.connect()
    }
    connect( type='mongodb' ) {
        const devMode = process.env.DEV_MODE
        const connectionString = devMode ? process.env.DEV_MONGO_CONNECTION_STRING : process.env.PRODUCT_MONGO_CONNECTION_STRING 
        console.log(connectionString)
        if(devMode) {
            mongoose.set('debug', true)
            mongoose.set('debug', {color: true})
        }       
        mongoose.connect(connectionString)
        .then(_ => {
            console.log(`Connected to mongodb`)
        })
        .catch(err => {
            console.log(`Connect to mongodb fail \n Error message: ${err}`)
        })
    }

    static getInstances = () => {
        if(!Database.instances)
            Database.instances = new Database()
        return Database.instances
    }
}

const databaseInstances = Database.getInstances()
module.exports = databaseInstances