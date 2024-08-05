<?php

require_once('../../settings.php');
require_once('../db/create_account.php');

$data = json_decode(file_get_contents('php://input'), true);

$email = $data['email'];
$key = $data['key'];

if ($email && $key) {
    $status = createAccount($email, $key);
    if ($status) {
        echo json_encode(['status' => 'ok']);
    } else {
        error_log('Error: Unable to create account.');
        echo json_encode(['status' => 'error', 'message' => 'Не удалось создать аккаунт']);
    }
} else {
    error_log('Error: Invalid data.');
    echo json_encode(['status' => 'error', 'message' => 'Некорректные данные']);
}
