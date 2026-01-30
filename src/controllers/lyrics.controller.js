const lyricsService = require('../services/lyrics.service');

class LyricsController {
    async getLyrics(req, res) {
        try {
            const { artist, song } = req.query;
            if (!artist || !song) {
                return res.status(400).json({ error: "El artista/canción es requerido" })
            }
            const lyrics = await lyricsService.fetchLyrics(artist, song);
            return res.json({ artist, song, lyrics });
        }
        catch (error) {
            const statusCode = error.statusCode || 500;
            res.status(statusCode).json({ error: error.message || 'Error interno en el servidor'});
        }
    }
}

module.exports = new LyricsController();