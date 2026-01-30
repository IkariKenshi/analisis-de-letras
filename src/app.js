const express = require('express');
const cors = require('cors');

require('dotenv').config();

const apiRoutes = require('./routes/api.routes');

const app = express();
const PORT = process.env.PORT || 3000;
//________________________________________________Middleware
app.use(cors());
app.use(express.json());

//________________________________________________Rutas (/api/...)
app.use('/api', apiRoutes);

//________________________________________________Arrnacar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto http://localhost:${PORT}`);
})