const lyricsService = require('../services/lyrics.service');

function dummy(req, res){
    res.json({ message: 'Hello World' });
}

module.exports = {
    dummy
}