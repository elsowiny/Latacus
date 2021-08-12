
import express from 'express';

import {  getStock, getStockQueryHandler} from  '../controllers/stocksController.js';

const router = express.Router();

router.get('/', getStockQueryHandler);

// this route is accessed via www.url.com/stocks/:stock
router.get('/:stock', getStock);

//we can access query params 
//like ?stock= or ?stocksym= by using 
//req.query.stock or req.query.stocksym

export default router;