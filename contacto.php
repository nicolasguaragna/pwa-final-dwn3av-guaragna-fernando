<?php
//configuracion para permitir solicitudes desde cualquier origen
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'POST') {//verifica si la solicitud es POST
    // obtener datos del formulario
    $nombre = $_POST['nombre'] ?? '';
    $apellido = $_POST['apellido'] ?? '';
    $email = $_POST['email'] ?? '';
    $mensaje = $_POST['mensaje'] ?? '';

    //para validar que todos los campos del form esten completos
    if (empty($nombre) || empty($apellido) || empty($email) || empty($mensaje)) {
        http_response_code(400);// para establecer codigo de respuesta
        echo json_encode(['error' => 'Todos los campos son obligatorios.']);
        exit();
    }

    //para validar formato de correo electrónico
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo json_encode(['error' => 'Formato de correo electrónico no válido']);
        exit();
    }

    //para validar longitud máxima del mensaje
    $maxLongitudMensaje = 500; // define el límite según las necesidades
    if (strlen($mensaje) > $maxLongitudMensaje) {
        http_response_code(400);
        echo json_encode(['error' => 'El mensaje excede la longitud máxima permitida']);
        exit();
    }

    // devuelve una respuesta exitosa
    $response = ['success' => true, 'message' => 'Mensaje recibido con éxito', 'data' => $_POST];
    echo json_encode($response);
} else {
    // devuelve un error si la solicitud no es POST
    http_response_code(400);
    echo json_encode(['error' => 'Bad Request']);
}
?>

