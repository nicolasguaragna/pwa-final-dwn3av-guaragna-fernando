<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // obtener datos del formulario
    $nombre = $_POST['nombre'] ?? '';
    $apellido = $_POST['apellido'] ?? '';
    $email = $_POST['email'] ?? '';
    $mensaje = $_POST['mensaje'] ?? '';

    // validar datos
    if (empty($nombre) || empty($apellido) || empty($email) || empty($mensaje)) {
        http_response_code(400);
        echo json_encode(['error' => 'Todos los campos son obligatorios.']);
        exit();
    }

    // validar formato de correo electrónico
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo json_encode(['error' => 'Formato de correo electrónico no válido']);
        exit();
    }

    // validar longitud máxima del mensaje
    $maxLongitudMensaje = 500; // define el límite según las necesidades
    if (strlen($mensaje) > $maxLongitudMensaje) {
        http_response_code(400);
        echo json_encode(['error' => 'El mensaje excede la longitud máxima permitida']);
        exit();
    }

    // realizar cualquier operación necesaria con los datos (almacenamiento, envío de correo, etc.)

    // devuelve una respuesta exitosa
    $response = ['success' => true, 'message' => 'Mensaje recibido con éxito', 'data' => $_POST];
    echo json_encode($response);
} else {
    // devuelve un error si la solicitud no es POST
    http_response_code(400);
    echo json_encode(['error' => 'Bad Request']);
}
?>

