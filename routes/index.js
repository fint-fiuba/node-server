const express = require('express');
const router = express.Router();

const saludar = (req, res) => {
    res.send('Hola');
}

module.exports = function() {
    router.get('/', saludar);
    return router;
}