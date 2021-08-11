const extraRouter = require('./routes/extraRouter');
var axios = require("axios").default;
const express = require('express')
const cors = require("cors");

const app = express()

// serve your css as static
app.use(express.static(__dirname+'/static'));

app.use(express.urlencoded({extended: false}))
app.use(express.json()) // To parse the incoming requests with JSON payloads

app.use(cors());
app.get('/', async (req, res) => {
    console.log(__dirname +'/static/index.html');
    res.sendFile(__dirname + "/static/index.html");
    

    
   
});
app.get('/stocks', async (req, res) => {
    console.log('stocks called');



    res.json({status: 200, message: 'stonks'});

    
   
});

app.use('/extra', extraRouter);


app.listen(5000, () => {
    console.log('Server is running on http://localhost:5000/');
} );