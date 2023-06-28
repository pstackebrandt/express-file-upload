'use strict';

import dom from './dom.js';

// KONSTANTEN / VARIABLEN
const elements = {};

// FUNKTIONEN
const domMapping = () => {
    elements.myForm = dom.$('#formUpload');
    elements.main = dom.$('main');
}

const renderFilelist = filelist => {
    console.log(filelist);
    elements.main.innerHTML = '';

    // Objekt iterieren
    Object.entries(filelist).forEach(file => {
        const container = dom.create({
            type: 'p',
            classes: ['container'],
            parent: elements.main
        })

        dom.create({
            type: 'a',
            parent: container,
            attr: {
                href: `uploads/${file[0]}`,
                download: file[1]
            },
            content: file[1]
        })
    })
}

const sendData = evt => {
    evt.preventDefault();

    // Daten aus dem Formuöar lesen und in die Variable schreiben
    let payload = new FormData(elements.myForm);

    fetch('/handle_form', {
        method: 'post',
        // headers werden nicht benötigt, da FormData standard ist
        body: payload
    }).then(
        res => res.json()
    ).then(
        res => renderFilelist(res.filenames)
    ).catch(
        console.warn
    )

}

const appendEventlisteners = () => {
    elements.myForm.addEventListener('submit', sendData);
}

const init = () => {
    domMapping();
    appendEventlisteners();
}

// INIT
init();