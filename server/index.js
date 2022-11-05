const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const router = require('./router/router');
const Auth = require('./router/auth');
const app = express()
const apiPort = 7012
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())
app.use(bodyParser.json())

app.use('/api', Auth.authRouter)
app.get('/', (req, res) => {
    res.send('Hello World!')
})
app.use('/api/member',router.MemberRouter)
app.use('/api/user', router.userRouter)
app.use('/api/service',router.ServiceRouter)
app.use('/api/upload',router.UploadRouter)
app.use('/api/accounting',router.AccountingRouter)
app.use('/api/product',router.ProductRouter)
app.use('/api/email',router.EmailRouter)
app.use('/api/event',router.EventRouter)
app.use('/api/coach',router.CoachRouter)
app.use('/api/resource',router.ResourceRouter)
app.listen(apiPort, () => console.log(`Server running on port ${apiPort}`))