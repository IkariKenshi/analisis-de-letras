const searchForm = document.getElementById('searchForm');
const statusDiv = document.getElementById('statusMessage');
const resultArea = document.getElementById('resultArea');

searchForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const artistInput = document.getElementById('artist').value.trim();
    const songInput = document.getElementById('song').value.trim();

    if(!artistInput || !songInput){
        alert('Por favor, ingrese un artista y una canción');
        return;
    }
    resultArea.style.display = 'none';
    statusDiv.innerHTML = '<p class="loading-message"> Buscando y analizando... (esto puede tardar unos segundos)</p>';

    try{
        const response = await fetch(`/api/lyrics?artist=${artistInput}&song=${songInput}`)
        if(!response.ok){
            //Error del servidor
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || 'Error al conectar con el servidor.');
        }

        const data = await response.json();

        console.log(data);

/* __________________________________________________________________ Columna de la izquierda letras */
        document.getElementById('songTitleDisplay').textContent = `${data.artist} - ${data.song}`;
        document.getElementById('lyricsContent').textContent = data.lyrics;
/* __________________________________________________________________ Columna de la derecha análisis */
        const analysisData = data.analysis || {};
        
        document.getElementById('themeDisplay').textContent = analysisData.tema_principal || 'No detectado';

        document.getElementById('summaryDisplay').textContent = analysisData.resumen || 'Sin resumen';
        document.getElementById('interpretationDisplay').textContent = analysisData.interpretacion || 'Sin interpretación';

        document.getElementById('voiceDisplay').textContent = analysisData.genero_voz_narrativa || 'Indeterminado';
        document.getElementById('genderDisplay').textContent = analysisData.genero_voz || 'Indeterminado';

//__________________________________________________________________ extras

        const brandsContainer = document.getElementById('brandsDisplay');
        const empresas = analysisData.empresas_mencionadas;

        if (empresas && empresas.length > 0) {
            // Unimos las marcas con comas y un emoji
            brandsContainer.innerHTML = `<strong>${empresas.join(', ')}</strong>`;
        } else {
            brandsContainer.textContent = 'No se detectaron marcas.';
        }
        //__________________________________________________________________ Error
        statusDiv.innerHTML = '';
        resultArea.style.display = 'grid';
    }

    catch(error){
        console.error('Error al buscar la letra:', error);
        statusDiv.innerHTML = `<div class="error-msg">⚠️ ${error.message}</div>`;
    }
});

/* 
const searchForm = document.getElementById('searchForm');
const resultsDiv = document.getElementById('results');
 const lyricsDiv = document.getElementById('lyrics');
const analysisDiv = document.getElementById('analysis');

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
            //Error del servidor
            const errorData = await response.json().catch(() => ({}))
            const errorMsg = errorData.error || 'No se encontró la canción, hubo un error al buscar la letra';

            resultsDiv.innerHTML = `<p class="error"> ${errorMsg} </p>`;
            return;
        }

        const data = await response.json();

        console.log(data);

        if(!data.lyrics || !data.analysis){
            throw new Error('No se encontró la letra o el análisis');
        }
        console.log(data.lyrics);
        console.log(data.artist);
        console.log(data.song);
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
            <p>Género de voz</p>
            <p>${data.analysis.genero_voz}</p>
            <p>Empresas mencionadas</p>
            ${data.analysis.empresas_mencionadas == [] ? `<p>${data.analysis.empresas_mencionadas}</p>` : '<p>No se encontraron empresas mencionadas</p>'}
        `;
    }
    catch(error){
        console.error('Error al buscar la letra:', error);
        resultsDiv.innerHTML = `<p class="error" style="color: red;">❌ Error de conexión: ${error.message}</p>`
    }
});



*/