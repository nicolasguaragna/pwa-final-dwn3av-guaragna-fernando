<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Recibe y procesa los datos del formulario
    $nombre = $_POST['nombre'];
    $email = $_POST['email'];
    $mensaje = $_POST['mensaje'];

    // Realiza cualquier operación necesaria con los datos (almacenamiento, envío de correo, etc.)

    // Devuelve una respuesta (puedes devolver JSON, HTML, etc.)
    echo json_encode(['success' => true, 'message' => 'Mensaje recibido con éxito']);
} else {
    // Devuelve un error si la solicitud no es POST
    http_response_code(400);
    echo json_encode(['error' => 'Bad Request']);
}
?>
