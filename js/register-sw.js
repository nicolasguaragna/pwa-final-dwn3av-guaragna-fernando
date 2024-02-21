//comprueba si el navegador admite service worker
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./service-worker.js') //registra el archivo
        .then(reg => {
            console.log("¡Service worker está listo!");//imprime msj en la consola si el registro es exitoso
        });
}

else{
    console.log("Service worker no soportado.");//imprime msj si el navegador no admite SW
}
//evento listener para cuando la conexion a internet se pierde
    window.addEventListener('offline', event => {
    document.querySelector('body').classList.add('offline');
    document.querySelector('body').innerHTML = "¡No se puede obtener la información! La aplicación esta offline!"
});
//evento para cuando la conexion se restablece -Online-
    window.addEventListener('online', event => {
    document.querySelector('body').classList.remove('offline');
    consultaApi();
});
//verifica si el browser esta actualmente sin conexion
if (!navigator.onLine) {
    document.querySelector('body').classList.add('offline');
    main.innerHTML = "¡No se puede obtener la información! La aplicación esta offline!"
}