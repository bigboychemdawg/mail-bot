<?php
require_once('../../settings.php');

$data = json_decode(file_get_contents('php://input'), true);
$telegramId = $data['telegramId'];

if (array_key_exists($telegramId, $users)) {
    echo json_encode(['status' => 'ok']);
} else {
    echo json_encode(['status' => 'error']);
}