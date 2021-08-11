const express = require('express')
const router = express.Router()

router.get('/',  (req, res) => {
    res.send('Hello from route extra');
})
router.get('/a',  (req, res) => {
    res.send('Hello from route a');
})



module.exports = router