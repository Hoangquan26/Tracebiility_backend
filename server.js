const app = require('./src/app')
const config = require('./src/configs/config')

const PORT = config.app.port

app.listen(PORT, () => {
    console.log(`Server start with port ${PORT}`)
})