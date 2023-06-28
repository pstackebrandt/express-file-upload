'use strict';

// VARIABLEN und KONSTANTEN
let filenames = {};
const paths = {
    filelist: 'data/filelist.json'
}


// FORMULARKRAM
// const formidable = require('formidable');
import formidable from 'formidable';
import fs from 'fs';

// WEBSERVER
// Express kann alternativ auch als ES-Modul importiert werden
import express from 'express';

// const express = require('express');
const server = express();

server.use(express.static('public', {
    extensions: ['html']
}));

// JSON-Daten aus einer POST-Anfrage eytrahieren und in das body-Attribut schreiben
server.use(express.json());

// ROUTEN
server.post('/handle_form', (request, response) => {
    // Formidable-Objekt anlegen
    const form = formidable({
        uploadDir: 'public/uploads',
        keepExtensions: true
    });

    // Formulardaten verarbeiten und die Daten als Parameter an die Callback-Funktion geben
    form.parse(request, (err, felder, dateien) => {
        if (err) console.log(err);
        else {
            // console.log(felder);
            // console.log(dateien);

            // Alte und neue Dateinamen miteinander verknüpfen
            // Die Dateien sind ein Array, das iteriert werden muss
            dateien.upload.forEach(file => {
                // Für jede Datei einen Eintrag im filenames-Objekt vornehmen
                filenames[file.newFilename] = file.originalFilename;
            })

            response.json({
                status: 'OK',
                filenames
            })

        }
    })
})

const storeFilelist = () => {
    fs.writeFile(
        paths.filelist,
        JSON.stringify(filenames),
        err => {
            if (err) console.log(err);
        }
    )
}

const init = () => {
    // Liste hochgeladener Dateien laden
    fs.readFile(
        paths.filelist,
        (err, content) => {
            if (!err) {
                filenames = JSON.parse(content.toString());
            }
            // Server starten
            server.listen(80, err => {
                if (err) console.log(err);
                else {
                    console.log('Server läuft')
                    setInterval(storeFilelist, 5000);
                }
            });
        },

    )

}

init();