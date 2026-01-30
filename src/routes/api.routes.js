const express = require('express');
const router = express.Router();
const lyricsController = require('../controllers/lyrics.controller');

//Rutas para la API

//Get: /lyrics
router.get('/lyrics', lyricsController.getLyrics);

module.exports = router;
