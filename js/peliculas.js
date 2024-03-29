let deferredPrompt;

// evento q se dispara antes de q aparezca la solicitud de inst de la PWA
window.addEventListener('beforeinstallprompt', (event) => {
    // previene q la solicitud de instalacion aparezca autom.
    event.preventDefault(); 
    deferredPrompt = event;

    //muestra el boton para instalar la PWA 
    const installButton = document.getElementById('installButton');
    if (installButton) {
        installButton.style.display = 'block';
        installButton.addEventListener('click', () => {
            //muestra la solicitud de instalacion
            deferredPrompt.prompt();

            //maneja la eleccion del usuario (acepta o rechaza)
            deferredPrompt.userChoice.then((choiceResult) => {
                if (choiceResult.outcome === 'accepted') {
                    console.log('User accepted the install prompt');
                } else {
                    console.log('User dismissed the install prompt');
                }
                
                //para limpiar la referencia a la solicitud y oculta el boton de instal.
                deferredPrompt = null;
                installButton.style.display = 'none'; 
            });
        });
    }
});

//este evento se dispara cuando la pag se carga completamente
window.addEventListener("load", async function() {//llama a la funcion 
    try {
        await pagOnline(); //muestra mensaje de error si hay algun problema en la carga
    } catch (error) {
        console.error(error.message);
        mostrarMensajeError('Hubo un error al cargar la página. Por favor, inténtalo de nuevo más tarde.');
    }
});
//funcion q se ejecuta despues de q la pag se carga completamente
async function pagOnline() {
    const formulario = document.getElementById("formulario");
    
    //si hay un formulario, agrega un evento listener para la busqueda
    if (formulario !== null) {
        formulario.addEventListener("submit", buscar);
        console.log(formulario);

        //recupera la última búsqueda almacenada en localStorage y llena el campo de búsqueda
        const ultimaBusqueda = localStorage.getItem('ultimaBusqueda');
        if (ultimaBusqueda) {
            formulario.elements['busquedaUsuario'].value = ultimaBusqueda;
        }
    }
}

// Función que realiza la consulta a la API - devuelve una promesa y maneja toda la lógica de la consulta a la API
async function realizarConsultaApi(busquedaRealizada) {
    const apiUrl = "https://www.omdbapi.com";
    const API_KEY = "3c08695a";

    //realiza una solicitud a la API utilizando fecht y espera la respuesta
    const response = await fetch(`${apiUrl}/?apikey=${API_KEY}&t=${busquedaRealizada}`);

    //tira un error si la respuesta no es exitosa
    if (!response.ok) {
        throw new Error(`Error de red: ${response.status}`);
    }

    //parsea la respuesta como json y la devuelve
    const infoPeli = await response.json();
    return infoPeli;
}

// funcion q se llama al realizar una busqueda
async function buscar(evento) {
    evento.preventDefault();
    
    //crea objeto formdata con datos del form
    const form = new FormData(this);

    //para verificar si el formulario es válido
    if (!this.checkValidity()) {
        console.warn('El formulario no es válido.');
        return;
    }

    // obtiene la busqueda del usuario desde el form
    const busquedaRealizada = form.get("busquedaUsuario");

    try {
        //realiza la consulta a la api y espera el resultado
        const infoPeli = await realizarConsultaApi(busquedaRealizada);
        consultaApi(infoPeli);

        //almacena la última búsqueda en localStorage
        localStorage.setItem('ultimaBusqueda', busquedaRealizada);
    } catch (error) {
        console.warn(error.message);//muestra mensaje de error si hay algun problem durante la busqueda
        mostrarMensajeError('Hubo un error al buscar la película. Por favor, inténtalo de nuevo más tarde.');
    }
}

// Función para mostrar mensajes de error al usuario
function mostrarMensajeError(mensaje) {
    
    const mensajeErrorElement = document.getElementById('mensajeError');
    //si hay elemento de msj con error, lo muestra con el msj proporcionado.
    if (mensajeErrorElement) {
        mensajeErrorElement.textContent = mensaje;
        mensajeErrorElement.style.display = 'block';
    }
}

// Función para obtener y mostrar todos los títulos
async function mostrarTodosTitulos() {
    const apiUrl = "https://www.omdbapi.com";
    const API_KEY = "3c08695a";

    // Realiza una solicitud a la API para obtener todos los títulos
    const response = await fetch(`${apiUrl}/?apikey=${API_KEY}&s=star wars*&type=movie`); // El parámetro 's=*' devuelve todos los títulos
    // Tira un error si la respuesta no es exitosa
    if (!response.ok) {
        throw new Error(`Error de red: ${response.status}`);
    }

    // Parsea la respuesta como JSON
    const resultados = await response.json();

    // Muestra los resultados en la lista de títulos
    mostrarResultadosEnLista(resultados.Search);
}

//maneja la respuesta de la api y muestra resultados en la pag
function consultaApi(infoPeli) {
    const resultadoConsulta = document.getElementById("respuesta");
    //muestra la info de la peli en una card
    resultadoConsulta.innerHTML = `
    <div class="card" style="max-width: 540px;">
        <div class="row no-gutters">
        <div class="col-md-7">
            <img src="${infoPeli.Poster}" alt="Poster película" />
        </div>
        <div class="col-md-5">
            <div class="card-body">
            <h4 class="card-title">${infoPeli.Title}</h4>
            <p class="card-text">${infoPeli.Plot}</p>
            <p class="card-text"><small class="text-muted">Valoración: ${infoPeli.imdbRating}</small></p>
            </div>
        </div>
        </div>
    </div>
    `;
    
    const formularioContacto = document.getElementById("formularioContacto");

    formularioContacto.addEventListener("submit", function (event) {
        event.preventDefault();
        //obtiene los valores de los campos del form de contacto
        const nombre = document.getElementById("nombre").value;
        const apellido = document.getElementById("apellido").value;
        const email = document.getElementById("email").value;
        const mensaje = document.getElementById("mensaje").value;

        //llama a la funcion para enviar el formulario de contacto con datos
        enviarFormularioContacto({ nombre, apellido, email, mensaje });
    });
}

//realizar la solicitud post al servidor con los datos del form
function enviarFormularioContacto(datosFormulario) {
    console.log('Datos del formulario:', datosFormulario);
    const apiUrl = "http://127.0.0.1:5501/contacto.php";  

    fetch(apiUrl, {//solicitud fetch con datos del form
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(datosFormulario),
    })
    .then((response) => {
        //tira un error si la respuesta no es exitosa.
        if (!response.ok) {
            throw new Error(`Error al enviar formulario: ${response.status}`);
        }
        return response.json();
    })
    .then((data) => {
        //muestra msj de exito o error segun respuesta del servidor.
        if (data.success) {
            console.log('Mensaje enviado con éxito:', data.message);
        } else {
            console.log('Error al enviar mensaje:', data.error);
            mostrarMensajeError('Hubo un error al enviar el formulario de contacto. Por favor, inténtalo de nuevo más tarde.');
        }
    })
    .catch((error) => {
        console.error('Error en fetch:', error);
        mostrarMensajeError('Hubo un error al enviar el formulario de contacto. Por favor, inténtalo de nuevo más tarde.');
    });
}

// Función para mostrar los resultados en la lista
function mostrarResultadosEnLista(resultados) {
    const listaTitulos = document.getElementById("lista-titulos");

    // Limpia la lista antes de agregar nuevos elementos
    listaTitulos.innerHTML = "";

        // Verifica si hay resultados y si hay un array de resultados
        if (resultados && Array.isArray(resultados)) {

    // Itera sobre los resultados y crea elementos de lista para cada título
    resultados.forEach((resultado) => {
        const li = document.createElement("li");
        li.textContent = resultado.Title;
        listaTitulos.appendChild(li);
    });
} else {
    console.error('La respuesta de la API no contiene datos válidos:', resultados);
    }
}
// Llama a la función para mostrar todos los títulos después de cargar la página
mostrarTodosTitulos();