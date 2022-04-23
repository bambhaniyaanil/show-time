var express = require('express');
var app = express();
var bodyParser = require('body-parser');
const db = require('./db');

const port = process.env.PORT || 8081;

var server = app.listen(port, function () {
    // var host = server.address().address
    // var port = server.address().port

    console.log("Example app listening at: ", port)
})

// parse application/json
app.use(bodyParser());

app.get('/', function (req, res) {
    console.log(req.headers.apikey);
    const apikey = req.headers.apikey;
    if (apikey) {
        res.send('Hello World');
    }
    else {
        res.send('Provide API key');
    }
})

app.post('/home', function (req, res) {
    console.log(req.body);
    res.send('Home');
    // response = {
    //     first_name: req.body.first_name,
    //     last_name: req.body.last_name
    // };
    // //  console.log(response);
    // res.end(JSON.stringify(req.body));
})

// get category
app.get('/api/get_category', async (req, res) => {
    try {
        let resulte = await db.get_category();
        const data = {
            status: true,
            data: resulte
        }
        res.json(data);
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
})

// get movie
app.post('/api/get_movie', async (req, res) => {
    const cat_id = req.body.cat_id;
    if (cat_id) {
        try {
            let resulte = await db.get_movie(cat_id);
            const data = {
                status: true,
                data: resulte
            }
            res.json(data);
        } catch (err) {
            console.log(err);
            res.sendStatus(500);
        }
    }
})

app.post('/userID', async (req, res) => {
    const id = req.body.id;
    // console.log('id', id);
    try {
        let resulte = await db.userID(id);
        res.json(resulte);
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
})
