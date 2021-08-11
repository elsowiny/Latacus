  
import express from 'express';

import { getStocks, getStock,} from '../controllers/stocksController';

const router = express.Router();

router.get('/', getStocks);
router.get('/:id', getStock);

export default router;