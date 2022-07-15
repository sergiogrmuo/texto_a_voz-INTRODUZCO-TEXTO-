/* particlesJS.load(@dom-id, @path-json, @callback (optional)); */
particlesJS.load('particles-js', 'assets/particles.json', function() {
    console.log('callback - particles.js config loaded');
});
// Seleccionar estos idiomas por defecto, en caso de que existan
let IDIOMAS_PREFERIDOS = ["es_ES"];

// Esperar a que el que DOM cargue
document.addEventListener("DOMContentLoaded", () => {
    let $voces = document.querySelector("#voces"),
        $boton = document.querySelector("#btnEscuchar"),
        $mensaje = document.querySelector("#mensaje");
    let posibleIndice = 0,
        vocesDisponibles = [];

    // Función que pone las voces dentro del select
    let cargarVoces = () => {
        if (vocesDisponibles.length > 0) {
            console.log("No se cargan las voces porque ya existen: ", vocesDisponibles);
            return;
        }
        vocesDisponibles = speechSynthesis.getVoices();
        console.log({ vocesDisponibles })
        posibleIndice = vocesDisponibles.findIndex(voz => IDIOMAS_PREFERIDOS.includes(voz.lang));
        if (posibleIndice === -1) posibleIndice = 0;
        vocesDisponibles.forEach((voz, indice) => {
            let opcion = document.createElement("option");
            opcion.value = indice;
            opcion.innerHTML = voz.name;
            opcion.selected = indice === posibleIndice;
            $voces.appendChild(opcion);
        });
    };

    // Si no existe la API, lo indicamos
    if (!'speechSynthesis' in window) return alert("Lo siento, tu navegador no soporta esta aplicación de texto a voz");

    // Lo pongo así (2 veces) por que he visto que si no se hace de esta forma en algunos casos solo funciona así (dependiendo el navegador)
    cargarVoces();
    // Si hay evento, entonces lo esperamos
    if ('onvoiceschanged' in speechSynthesis) {
        speechSynthesis.onvoiceschanged = function() {
            cargarVoces();
        };
    }
    // El click del botón para escuchar el mensaje y configuración de algunos parámetros ()
    $boton.addEventListener("click", () => {
        let textoAEscuchar = $mensaje.value;
        if (!textoAEscuchar) return alert("No has introducido ningún texto para que pueda ponerle voz");
        let mensaje = new SpeechSynthesisUtterance();
        mensaje.voice = vocesDisponibles[$voces.value];
        mensaje.volume = 1;
        mensaje.rate = 1;
        mensaje.text = textoAEscuchar;
        mensaje.pitch = 1;
        // Con este comando hacemos que se diga con voz el mensaje introducido
        speechSynthesis.speak(mensaje);
    });
});