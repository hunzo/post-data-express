const ex = require('express')
const morgan = require('morgan')
const jwt = require('jsonwebtoken')
const multer = require('multer')

app = ex()
app.use(morgan('combined'))
app.use(ex.json())
app.use(ex.urlencoded({extended: true}))

app.get('/', (req, res) => {
    res.json({
        status: 'post example',
        urlencode: '/urlencode',
        header: '/header',
        json: '/json',
        form_data: '/formdata'
    })
})

app.get('/urlencode', (req, res) => {
      res.send(
        `
            <form method="POST" action="/urlencode">
                <input type="text" name="username" placeholder="username is 123456">
                <input type="submit">
            </form>
        `
        )
})

app.post('/urlencode', (req, res) => {

    if (req.body.username != '123456') {
        return res.json({ error: 'invalid username'})
    }

    res.json({
        "content-type": req.header('content-type'),
        body: req.body
    })

})

app.post('/header', (req, res) => {

    !req.header('x-api-key') == 'x_api_key' ? res.json({error: 'no headers or invalid headers x_api_key'}) :
    !req.headers.apikey == 'api_key' ? res.json({error: 'no headers or invalid headers apikey'}) :

    res.json({
        status: 'headers example',
        header: req.headers,
        token: jwt.sign({info: 'create jwt'}, 'secretKey', {expiresIn: 60 })
    })
})

app.post('/json', (req, res) => {

    // check body isEmpty
    Object.keys(req.body).length === 0 ? res.json({ error: 'handler empty'}) :
    
    req.body.client_id != "123456" ? res.json({ error: 'invalid client id'}) :
    req.body.client_secret != "mysecret" ? res.json({ error: 'invalid client secret'}) :
    req.body.grant_type != "refresh_token" ? res.json({ error: 'invalid grant_type'}) :

    res.json({
        result: 'json-data example',
        body: req.body,
        token: jwt.sign(req.body, 'key', { expiresIn: 60})
    })
})

app.post('/formdata', multer().array(), (req, res) => {

    if (!req.is('multipart/form-data')) {
        return res.json({
            error: 'invalid content-type'
        })
    }

    // ex. 
    // !req.body.client_id ? res.json({ error: 'invalid client id'}) : 
    // !(req.body.client_id == 'test') ? res.json({ error: 'no test'}) : res.end()

    !req.body.client_id ? res.json({ error: 'no client_id'}) : !(req.body.client_id == '123456') ? res.json({ error: 'invalid ClientId'}) :
    !req.body.client_secret ? res.json({ error: 'no client_secret'}) : !(req.body.client_secret == 'mysecret') ? res.json({ error: 'invalid ClientSecret'}) :
    !req.body.grant_type ? res.json({ error: 'no grant_type'}) : !(req.body.grant_type == 'refresh_token') ? res.json({ error: 'invalid grant_type'}) :

    console.log(req.body)
    console.log(req.headers)

    res.json({
        result: 'form-data - example',
        body: req.body,
        token: jwt.sign(req.body, 'key', {expiresIn: 60 })
    })
})

app.listen(process.env.PORT || 3000)
