import express from 'express';
import axios from 'axios';



const router = express.Router();


export const getStockQueryHandler = async (req, res) => {
    console.log('getStocks');
    console.log('stocks called');
    
    if(req.query.stock){
        console.log(req.query.stock);
        res.json({status: 200, message: 'stonks '+req.query.stock});
    }else{
    res.json({status: 200, message: 'stonks '});
    }


    
}


export const getStock = async (req, res) => {
   
    console.log('getStock ' );
    const {stock } = req.params;
    console.log(stock);


    let historicalData;
    var options = {
        method: 'GET',
        url: 'https://apidojo-yahoo-finance-v1.p.rapidapi.com/stock/v3/get-historical-data',
        params: {symbol: stock, region: 'US'},
        headers: {
          'x-rapidapi-key': process.env.RAPID_API_KEY,
          'x-rapidapi-host': 'apidojo-yahoo-finance-v1.p.rapidapi.com'
        }
      };
      
      axios.request(options).then(function (response) {
 
        if(response.status === 200){
        //console.log(response.data);
          historicalData = response.data.prices;
          let historicalDataPrices = [];

          //filter our data to only include prices
          historicalData.forEach(function(item){
            if(!item.type){
                historicalDataPrices.push(item);
            }
        });

          res.json({status: 200, data: historicalDataPrices});
        } 
          
      }).catch(function (error) {
          console.error(error);
          res.json({status: 302, message: 'invalid stock '+ stock});
      });


   
}

export default router;