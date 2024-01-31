window.addEventListener("load", async function() {
    try {
        await pagOnline();
    } catch (error) {
        console.error(error.message);
    }
});

async function pagOnline() {
var formulario = document.getElementById("formulario");

if (formulario !== null) {
    formulario.addEventListener("submit", buscar);
    console.log(formulario);

    // Recupera la última búsqueda almacenada en localStorage y llena el campo de búsqueda
    const ultimaBusqueda = localStorage.getItem('ultimaBusqueda');
    if (ultimaBusqueda) {
        formulario.elements['busquedaUsuario'].value = ultimaBusqueda;
    }
}
}

async function buscar(evento) {
    evento.preventDefault();

    const form = new FormData(this);

    // Verifica si el formulario es válido
    if (!this.checkValidity()) {
        console.warn('El formulario no es válido.');
        return;
    }

    const busquedaRealizada = form.get("busquedaUsuario");
    const apiUrl = "https://www.omdbapi.com";
    API_KEY = "3c08695a";

try {
    const response = await fetch(`${apiUrl}/?apikey=${API_KEY}&t=${busquedaRealizada}`);
    console.log(`${apiUrl}/?apikey=${API_KEY}&t=${busquedaRealizada}`);
    
    if (!response.ok) {
        throw new Error(`Error de red: ${response.status}`);
    }

    const infoPeli = await response.json();
    consultaApi(infoPeli);

        // Almacena la última búsqueda en localStorage
        localStorage.setItem('ultimaBusqueda', busquedaRealizada);
    } catch (error) {
        console.warn(error.message);
    }
}

function consultaApi(infoPeli) {
    const resultadoConsulta = document.getElementById("respuesta");
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

        const nombre = document.getElementById("nombre").value;
        const email = document.getElementById("email").value;
        const mensaje = document.getElementById("mensaje").value;

        // Aquí puedes realizar la solicitud POST al servidor con los datos del formulario
        enviarFormularioContacto({ nombre, email, mensaje });
    });
}

function enviarFormularioContacto(datosFormulario) {
    const apiUrl = "http://127.0.0.1:5501/api-contacto.php";

    fetch(apiUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(datosFormulario),
    })
    .then((response) => {
        if (!response.ok) {
            throw new Error(`Error al enviar formulario: ${response.status}`);
        }
        return response.json();
    })
    .then((data) => {
        // Aquí puedes manejar la respuesta del servidor, como mostrar un mensaje al usuario
        console.log(data);
    })
    .catch((error) => {
        console.error(error.message);
    });
}