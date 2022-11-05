const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const router = require('./router');
const Auth = require('./auth');
const app = express()
const apiPort = 7011

app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())
app.use(bodyParser.json())

app.use('/memberapi', Auth.authRouter)
app.get('/', (req, res) => {
    res.send('Hello World!')
})
app.use('/memberapi/user', router.userRouter)
app.use('/memberapi/event',router.eventRouter)
app.use('/memberapi/member',router.memberRouter)
app.use('/memberapi/home',router.homeRouter)
app.listen(apiPort, () => console.log(`Server running on port ${apiPort}`))