const axios = require('axios');

class LLMService {

    async analyzeLyrics(lyrics) {
        try {
            //Prompt de prepracion para la IA
            const prompt = `
               Actua como una API REST que devuelve datos crudos.
               Analiza la siguiente letra y responde ÚNICAMENTE con un objeto JSON.
               NO saludes, NO des explicaciones, NO uses markdown.
                
                Estructura requerida del JSON:
                {
                    "tema_principal": "Amor, Desamor, Muerte, Crítica social, Crítica política, Religión, Experiencia personal, u Otro",
                    "resumen": "Resumen breve en español",
                    "interpretacion": "Una interpretación del significado de la canción, especialmente en los casos en los que: Existen metáforas, el mensaje no sea literal, El significado requiera un análisis más profundo.",
                    "genero_voz_narrativa": "Indicar si la canción está cantada desde la perspectiva de:Masculino, Femenino o indeterminado (si no es posible inferirlo claramente)",
                    "empresas_mencionadas": ["Nombre de empresas","Lista de marcas", "productos"]
                }
                    Letra a analizar:
                "${lyrics.slice(0, 2500)}"
                `;

            const response = await axios.post(`https://apifreellm.com/api/v1/chat`,
                {
                    "message": prompt
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': process.env.LLM_API_KEY
                    }

                }
            );

            const apiData = response.data;

            if (!apiData.success || apiData.status == false) {
                console.error('Error en la API: ', apiData);
                throw new Error('La API de la IA no pudo realizar la solicitud');
            }

            let iaTextResponse = apiData.response || '';


            //En caso de que la IA regrese algo que no sea un JSON, lo eliminamos
            const jsonMatch = iaTextResponse.match(/{[\s\S]*}/);

            if (jsonMatch) {
                // Si encontramos algo que parece JSON, usamos eso.
                iaTextResponse = jsonMatch[0];
            }
            else 
                {
                    throw new Error("No se encontró un objeto JSON en la respuesta de la IA");
                }


                //Convertir string a objeto 
                return JSON.parse(iaTextResponse);

            } catch (error) {
                console.error("Error al parsear el análisis:", error.message);
                // Devolvemos un análisis desechable para evitar un error en el frontend si la IA falla
                return {
                    tema_principal: "Error al analizar",
                    resumen: "La IA respondió con formato inválido.",
                    interpretacion: "Intenta de nuevo.",
                    genero_voz_narrativa: "Indeterminado",
                    empresas_mencionadas: []
                };
            }
        }

}

module.exports = new LLMService();