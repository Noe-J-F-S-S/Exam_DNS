const express = require('express');
const router = express.Router();

//Asignando la página principal
router.get('/', ( req, res) =>{
    res.render('index');
});

//Enlace al About
router.get('/about', ( req, res) =>{
    res.render('about');
});

module.exports = router;