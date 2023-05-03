const express = require('express');
const cors = require('cors');
const path = require('path');

const { dbConnection } = require('./db/config');
require('dotenv').config();

//Crear el servidor/aplicación de express
const app = express();

//Conexion DB
dbConnection();

//Directorio publico
app.use( express.static('public'));

//CORS
app.use( cors() );

//Lectura de parseo del body
app.use( express.json() );

//Rutas
app.use('/api/auth', require('./routes/auth'));

//Manejar las demas rutas
app.get( '*', (req, res) => {
    res.sendFile( path.resolve( __dirname, 'public/index.html'))
})

//Defino el puerto 
app.listen( process.env.PORT, () => {
    console.log(`Servidor corriendo en puerto ${process.env.PORT}`)
} );