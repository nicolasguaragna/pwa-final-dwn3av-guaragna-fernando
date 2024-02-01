<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Obtener datos del formulario
    $nombre = $_POST['nombre'] ?? '';
    $apellido = $_POST['apellido'] ?? '';
    $email = $_POST['email'] ?? '';
    $mensaje = $_POST['mensaje'] ?? '';

    // Validar datos
    if (empty($nombre) || empty($apellido) || empty($email) || empty($mensaje)) {
        http_response_code(400);
        echo json_encode(array('error' => 'Todos los campos son obligatorios.'));
        exit();
    }

    //se puede agregar más validaciones aca, como verificar el formato del correo electrónico, longitud del mensaje, etc.

    // Realizar cualquier operación necesaria con los datos (almacenamiento, envío de correo, etc.)

    // Devuelve una respuesta exitosa
    $response = ['success' => true, 'message' => 'Mensaje recibido con éxito', 'data' => $_POST];
    echo json_encode($response);
} else {
    // Devuelve un error si la solicitud no es POST
    http_response_code(400);
    echo json_encode(['error' => 'Bad Request']);
}
?>
