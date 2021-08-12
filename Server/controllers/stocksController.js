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


export const getStockSummary = async (req,  res) => {
  console.log('getting summary');
  const {stock } = req.params;
  console.log(stock);
var options = {
  method: 'GET',
  url: 'https://apidojo-yahoo-finance-v1.p.rapidapi.com/stock/v2/get-summary',
  params: {symbol: stock, region: 'US'},
  headers: {
    'x-rapidapi-key': process.env.RAPID_API_KEY,
    'x-rapidapi-host': 'apidojo-yahoo-finance-v1.p.rapidapi.com'
  }
};

axios.request(options).then(function (response) {
	//console.log(response.data);
  var summaryProfile = response.data.summaryProfile.longBusinessSummary;
  var website = response.data.summaryProfile.website;
  var profitMargins = response.data.defaultKeyStatistics.profitMargins.fmt;
  var bookValue = response.data.defaultKeyStatistics.bookValue.fmt;
  var fiftyTwoWeekChange = response.data.defaultKeyStatistics["52WeekChange"].fmt;

  let dataSum = {
    summaryProfile: summaryProfile,
    website: website,
    profitMargins: profitMargins,
    bookValue: bookValue,
    fiftyTwoWeekChange: fiftyTwoWeekChange
  };

  //console.log(summaryProfile);
  res.json({status: 200, data: dataSum});
}).catch(function (error) {
	console.error(error);
});



};



const getMessageBoardId = async ( {stock}, callback) => {
  let messageBoardIdData;
  console.log('getting message board id');
  var options = {
    method: 'GET',
    url: 'https://apidojo-yahoo-finance-v1.p.rapidapi.com/market/v2/get-quotes',
    params: {region: 'US', symbols: stock},
    headers: {
      'x-rapidapi-key': process.env.RAPID_API_KEY,
      'x-rapidapi-host': 'apidojo-yahoo-finance-v1.p.rapidapi.com'
    }
  };

  

  
  
 await axios.request(options).then(function (response) {
    console.log(response.data.quoteResponse.result[0].messageBoardId);
    console.log('first data req');
     messageBoardIdData = response.data.quoteResponse.result[0].messageBoardId;
     callback(messageBoardIdData);
  }).catch(function (error) {
    console.error(error);
    callback(error)
    
  });




}


export const getStockNews = async (req,  res) => {
  const {stock } = req.params;
  console.log('getting news for ' + stock);
  
  console.log('accessing messageboard func');
  //const messageBoardIdData = await getMessageBoardId({stock});
  getMessageBoardId({stock}, function(result){
    console.log('this is the result of calling get messageboard id w/ callback');
    console.log(result);
  





    var options = {
      method: 'GET',
      url: 'https://apidojo-yahoo-finance-v1.p.rapidapi.com/conversations/list',
      params: {
        symbol: stock,
        messageBoardId: result,
        region: 'US',
        userActivity: 'true',
        sortBy: 'createdAt',
        off: '0'
      },
      headers: {
        'x-rapidapi-key': '056809759amshf0e6e98e9ea6c10p1bd76djsn21163bf07906',
        'x-rapidapi-host': 'apidojo-yahoo-finance-v1.p.rapidapi.com'
      }
    };
    
    axios.request(options).then(function (response) {
     // console.log(response.data.canvassMessages);
      let msgs = [];
      let msg = {};
      response.data.canvassMessages.forEach(function(item){
        msg = {
          namespace: item.namespace,
          author: item.meta.author.nickname,
          text: item.details.userText,
          entity: item.meta.messageEntity
        };
        msgs.push(msg);
      });
      //console.log(msgs);
      res.json({status: 200, data: msgs});
    }).catch(function (error) {
      console.error(error);
      res.json({status: 302, message: 'invalid stock '+ stock});
    });







  });
  //console.log(messageBoardIdData);
  console.log('did we await?');
 








};




export default router;