const express = require('express');
const router = express.Router();


router.get('/', (req, res) => {
    res.render('./pricing', {req, res});
});

module.exports = router;

