# Análisis de letras

Aplicación web para obtener letras de canciones y analizarlas con IA (tema, resumen, interpretación, género de voz, empresas mencionadas, etc.). 

Construido con una arquitectura limpia en Node.js y un frontend ligero en Vanilla JS.

---

## Instalación

1. **Clonar el repositorio** (o descargar el código):
   ```
   git clone https://github.com/IkariKenshi/analisis-de-letras.git
   cd analisis-de-letras
   ```

2. **Instalar dependencias** con npm:
   ```
   npm install
   ```
Dependencias clave: express (servidor), axios (peticiones HTTP), cors (seguridad), dotenv (variables de entorno).

---

## Configuración

1. **Crear un archivo `.env`** en la raíz del proyecto con las siguientes variables:

   ```env
   LLM_API_KEY=tu_api_key_de_apifreellm
   ```

   -**PORT**: Puerto del servidor (3000 por defecto).

   -**LLM_API_KEY**: Tu clave para apifreellm.com. 
   Nota: Asegúrate de incluir la palabra "Bearer" si tu código la espera, o solo el token según tu configuración.
   ej: LLM_API_KEY=Bearer key

2. No es necesario configurar nada más para la API de letras: el proyecto usa [LRCLIB](https://lrclib.net) de forma pública (sin API key).

---

## Ejecución del proyecto

- **Modo producción:**
   ```
  npm start
   ```

- **Modo desarrollo** (reinicio automático con nodemon):
   ```
  npm run dev
   ```

El servidor quedará respondera en `http://localhost:3000` (o en el puerto indicado en `PORT`). La interfaz web se sirve desde la carpeta `public/` y la API bajo la ruta `/api/`.

**Ejemplo de uso de la API:**
   ```
   http
   GET /api/lyrics?artist=Nombre del artista&song=Nombre de la canción
   ```
---

## Decisiones técnicas
Durante el desarrollo, se tomaron decisiones enfocadas en la estabilidad y la escalabilidad del código:

1. Selección de API de Letras (Estabilidad): Inicialmente se usó la API Lyrics.ovh. Sin embargo, durante la fase de pruebas presentó una alta tasa de fallos, incluyendo tiempos de espera agotados (timeouts) y errores 504. Para garantizar la disponibilidad del servicio, se tomó la decisión de migrar a LRCLIB, la cual ofrece tiempos de respuesta consistentes y mayor estabilidad.

2. Arquitectura en Capas (Separation of Concerns)
Se evitó centralizar la lógica en el controlador. El código se separó en servicios dedicados:

   lyrics.service.js: Encargado de la comunicación con LRCLIB.

   llm.service.js: Encargado del análisis con IA.

   Beneficio: Facilita el mantenimiento. Si en el futuro se cambia el proveedor de IA (ej. a OpenAI) o la fuente de letras, solo se modifica el servicio correspondiente sin romper el controlador ni las rutas.

3. Prompt Robusto: Diseñé un prompt estricto y añadí una capa de "limpieza" con Expresiones Regulares en el backend para asegurar que, aunque la IA quiera "hablar", el sistema extraiga siempre un JSON válido para el frontend.

4. Frontend sin Frameworks (Simplicidad) Se uso HTML5 y JS Vanilla permite que la app sea extremadamente ligera y fácil de auditar.

5. Se optó por encapsular la lógica en clases (LyricsService, LLMService) en lugar de funciones aisladas.

   Escalabilidad: Permite centralizar configuraciones (como API Keys o Base URLs) en el constructor.

   Reusabilidad: Si se agregan nuevos métodos que consuman la misma API, estos reutilizan la configuración existente (this.apiKey).

---

## Arquitectura general

El proyecto sigue el patrón MVC (simplificado a Controller-Service).

```
analisis-de-letras/
├── public/                 # Frontend estático
│   ├── index.html
│   ├── script.js           # Llamadas a /api/lyrics y presentación de resultados
│   └── styles.css
├── src/
│   ├── app.js              # Entrada: Express, CORS, rutas, servidor
│   ├── routes/
│   │   └── api.routes.js   # Define GET /api/lyrics
│   ├── controllers/
│   │   └── lyrics.controller.js   # Recibe artist/song, coordina servicios, responde JSON
│   └── services/
│       ├── lyrics.service.js      # Obtiene letra vía LRCLIB
│       └── llm.service.js         # Envía letra a IA y devuelve análisis en JSON
├── .env                    #  LLM_API_KEY
├── package.json
└── README.md
```

**Flujo de datos**:
1. Usuario busca "Artista - Canción" en el Frontend.
2. Petición a GET /api/lyrics.
3. Controlador solicita letra a lyrics.service.
4. Controlador envía letra a llm.service para análisis.
5. Backend responde un JSON unificado: { artist, song, lyrics, analysis }.

---

## Supuestos realizados

-Entrada de datos: Se asume que el usuario conoce el nombre del artista y de la canción (no hay búsqueda difusa o fuzzy search).

-Latencia de IA: El análisis se realiza con un LLM gratuito, lo que puede implicar tiempos de respuesta de ~3 a 5 segundos.

-Manejo de Errores: Si la IA falla o no devuelve un JSON válido tras el intento de limpieza, el servicio devuelve un objeto de análisis por defecto ("Indeterminado") para no romper la experiencia de usuario.

-Persistencia: La aplicación es stateless (sin estado); cada petición procesa la información en tiempo real sin guardarla en base de datos.
