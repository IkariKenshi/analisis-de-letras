const searchForm = document.getElementById('searchForm');
const statusDiv = document.getElementById('statusMessage');
const resultArea = document.getElementById('resultArea');

searchForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const artistInput = document.getElementById('artist').value.trim();
    const songInput = document.getElementById('song').value.trim();

    if (!artistInput || !songInput) {
        alert('Por favor, ingrese un artista y una canción');
        return;
    }
    /* __________________________________________________________________Bloqueo de botón */
    searchButton.disabled = true;


    resultArea.style.display = 'none';
    statusDiv.innerHTML = '<p class="loading-message"> Buscando y analizando... (esto puede tardar unos segundos)</p>';

    try {
        const response = await fetch(`/api/lyrics?artist=${artistInput}&song=${songInput}`)
        if (!response.ok) {
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

        //__________________________________________________________________ Datos extra de la canción

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

    catch (error) {
        console.error('Error al buscar la letra:', error);
        statusDiv.innerHTML = `<div class="error-msg">⚠️ ${error.message}</div>`;
    }
    finally {
        searchButton.disabled = false;
    }
});