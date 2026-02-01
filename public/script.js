const searchForm = document.getElementById('searchForm');
const resultsDiv = document.getElementById('results');
/* const lyricsDiv = document.getElementById('lyrics');
const analysisDiv = document.getElementById('analysis');
 */
const searchButton = document.getElementById('searchButton');


searchForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const artistInput = document.getElementById('artist').value.trim();
    const songInput = document.getElementById('song').value.trim();

    if(!artistInput || !songInput){
        alert('Por favor, ingrese un artista y una canción');
        return;
    }
    resultsDiv.innerHTML = '<p>⏳ Buscando y analizando... (esto puede tardar unos segundos)</p>';

    try{
        const response = await fetch(`/api/lyrics?artist=${artistInput}&song=${songInput}`)
        if(!response.ok){
            throw new Error('Error al buscar la letra');
        }
        console.log(response);
        const data = await response.json();
        console.log(data);
        if(!data.lyrics || !data.analysis){
            throw new Error('No se encontró la letra o el análisis');
        }
        console.log(data.lyrics);
        console.log(data.artist);
        console.log(data.song);
        console.log(data.analysis.tema_principal);
        console.log(data.analysis.resumen);
        console.log(data.analysis.interpretacion);
        console.log(data.analysis.genero_voz_narrativa);
        console.log(data.analysis.empresas_mencionadas);
        resultsDiv.innerHTML = `
            <h2>${data.artist} - ${data.song}</h2>
            <p>Letra de la canción</p>
            <p>${data.lyrics}</p>
            <h3>Análisis</h3>
            <p>Tema principal</p>
            <p>${data.analysis.tema_principal}</p>
            <p>Resumen</p>
            <p>${data.analysis.resumen}</p>
            <p>Interpretación</p>
            <p>${data.analysis.interpretacion}</p>
            <p>Género de voz narrativa</p>
            <p>${data.analysis.genero_voz_narrativa}</p>
            <p>Empresas mencionadas</p>
            ${data.analysis.empresas_mencionadas == [] ? `<p>${data.analysis.empresas_mencionadas}</p>` : '<p>No se encontraron empresas mencionadas</p>'}
        `;
    }
    catch(error){
        console.error('Error al buscar la letra:', error);
    }
});