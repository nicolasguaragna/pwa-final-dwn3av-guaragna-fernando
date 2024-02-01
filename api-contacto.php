<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Recibe y procesa los datos del formulario
    $nombre = $_POST['nombre'];
    $apellido = $_POST['apellido'];
    $email = $_POST['email'];
    $mensaje = $_POST['mensaje'];

    // Realiza cualquier operación necesaria con los datos (almacenamiento, envío de correo, etc.)

    // Devuelve una respuesta (puedes devolver JSON, HTML, etc.)
    $response = ['success' => true, 'message' => 'Mensaje recibido con éxito', 'data' => $_POST];
    echo json_encode($response);
} else {
    // Devuelve un error si la solicitud no es POST
    http_response_code(400);
    echo json_encode(['error' => 'Bad Request']);
}
?>
