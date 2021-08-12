import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import stocksRouter from './routes/stocksRouter.js';
const app = express()
dotenv.config();




app.use(express.urlencoded({extended: false}))
app.use(express.json()) // To parse the incoming requests with JSON payloads

app.use(cors());
app.get('/', async (req, res) => {
    /*
    var options = {
        method: 'GET',
        url: 'https://apidojo-yahoo-finance-v1.p.rapidapi.com/stock/v3/get-historical-data',
        params: {region: 'US', lang: 'en-US', count: '6', start: '0'},
        headers: {
          'x-rapidapi-key': process.env.RAPID_API_KEY,
          'x-rapidapi-host': 'apidojo-yahoo-finance-v1.p.rapidapi.com'
        }
      };
      
      axios.request(options).then(function (response) {

          console.log(response.data);
          //console.log(response.data.finance);
          console.log('response data finance');
          console.log(response.data.finance);
      }).catch(function (error) {
          console.error(error);
      });
*/
    
   
});


app.use('/stocks/', stocksRouter);


app.listen(5000, () => {
    console.log('Server is running on http://localhost:5000/');
} );