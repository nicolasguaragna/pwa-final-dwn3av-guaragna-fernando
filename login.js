//se importan las funciones de los sdk de firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-analytics.js";
import { getAuth , signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCNJTNafSsD1Ynm3_aif2MJ0IAbi-_5qbk",
    authDomain: "lista-de-pelis-d2ca6.firebaseapp.com",
    projectId: "lista-de-pelis-d2ca6",
    storageBucket: "lista-de-pelis-d2ca6.appspot.com",
    messagingSenderId: "123120943420",
    appId: "1:123120943420:web:85e89e2d3c497174ab1e39",
    measurementId: "G-38YPGSDYLC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

const application = new Vue({
    el:'#app',
    data: {
        email: "",
        password: ""
    },
    methods: {
        login() {// Iniciar sesión con correo electrónico y contraseña utilizando la autenticación de Firebase
            signInWithEmailAndPassword(auth, this.email, this.password)
                .then(userCredential => {//Si tiene éxito redirige a otra página
                    window.location.replace("http://127.0.0.1:5501/index.html");
                })
                .catch(error => {// Si hay un error muestra una alerta con el mensaje de error
                    const errorCode = error.code;
                    const errorMessage = error.message;

                    alert(errorMessage);
                })    
        }   
    }
}
);
