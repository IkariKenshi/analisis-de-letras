const axios = require('axios');

class LyricsService {
//_________________________________________________________Obteción de letras
    async fetchLyrics(artist, song){
        try{
            console.log(artist, song);
            const response = await axios.get('https://lrclib.net/api/get', {
                params: {
                    artist_name: artist,
                    track_name: song
                },
                timeout: 20000
            });

            if(!response.data || !response.data.plainLyrics){
                return null;
            }

            return response.data.plainLyrics;
        }
        catch(error){
            if(error.code === 'ECONNABORTED' || error.message?.includes('timeout')){
                const timeoutError = new Error('El tiempo de espera se agotó. Verifica el nombre del artista y la canción.');
                timeoutError.statusCode = 408;
                throw timeoutError;
            }

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