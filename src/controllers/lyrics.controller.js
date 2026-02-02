const lyricsService = require('../services/lyrics.service');
const llmService = require('../services/llm.service');

class LyricsController {
    async getLyrics(req, res) {
        try {

            const { artist, song } = req.query;
            if (!artist || !song) {
                return res.status(400).json({ error: "El artista/canción es requerido" })
            }

//_________Paso 1: Consultamos la letra para posteriormente enviarla a la IA
            console.log("Consultando la letra de la canción...")
            const lyrics = await lyricsService.fetchLyrics(artist, song);
            if(!lyrics){
                return res.status(404).json({ error: "Letra no encontrada" });
            }
            /* console.log("Letra encontrada:", lyrics.slice(0, 50)); */

//_________Paso 2: Llamamos a llmService para analizar la letra con IA
            console.log("Analizando la letra de la canción...")
            const analysis = await llmService.analyzeLyrics(lyrics, artist, song);
            if(!analysis){
                return res.status(500).json({ error: "Error al analizar la letra de la canción" });
            }
            console.log("Análisis realizado:", analysis);

            return res.json({
                artist,
                song,
                lyrics,
                analysis
            })
        }
        catch (error) {
            const statusCode = error.statusCode || 500;
            res.status(statusCode).json({ error: error.message || 'Error interno en el servidor'});
        }
    }
}

module.exports = new LyricsController();