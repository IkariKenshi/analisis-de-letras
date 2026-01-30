const axios = require('axios');

class LyricsService {
//_________________________________________________________Obteción de letras
    async fetchLyrics(artist, song){
        try{
            const safeArtist = encodeURIComponent(artist);
            const safeSong = encodeURIComponent(song);
            const response = await axios.get(`https://api.lyrics.ovh/v1/${safeArtist}/${safeSong}`);

            //La API devuelve {lyrics: "texto de la canción"}
            //console.log(response.data);
            return response.data.lyrics;
        }
        catch(error){
            //Manejo de error 404 (cancion no encontrada en la API)
            if(error.response && error.response.status === 404){
                const notFoundError = new Error(`Letra no encontrada de la canción "${song}" del artista "${artist}"`);
                // Usare una etiqueta "404" para que el Controlador sepa qué hacer
                notFoundError.statusCode = 404; 
                throw notFoundError;
            }
            console.error('Error en LyricsService:', error.message);
            throw error;
        }
    }
}

module.exports = new LyricsService();