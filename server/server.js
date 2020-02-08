require('./config/config');

const express = require('express');
const mongoose = require("mongoose");

const app = express()
const bodyParser = require("body-parser");


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

//Configuracion Global de Rutas
app.use(require('./routes/index'));

mongoose.connect(process.env.URLDB, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true },
    (err, res) => {

        if (err) throw err;

        console.log('BD online');

    });

app.listen(process.env.PORT, () => {
    console.log("Escuchando en el puerto:", 3000);
});