<?php

require_once('../../settings.php');
require_once('../db/delete_account.php');

$data = json_decode(file_get_contents('php://input'), true);
$ids = $data['ids'];

if (!empty($ids)) {
    $status = deleteAccounts($ids);
    if ($status) {
        echo json_encode(['status' => 'ok']);
    } else {
        error_log('Error: Unable to delete accounts.');
        echo json_encode(['status' => 'error', 'message' => 'Не удалось удалить аккаунты']);
    }
} else {
    error_log('Error: No IDs provided.');
    echo json_encode(['status' => 'error', 'message' => 'Нет идентификаторов для удаления']);
}
